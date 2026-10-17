
import { readFile } from "node:fs/promises";
import path from "node:path";

type CsvRow = Record<string, string>;

type Observation = {
  eventId: string;
  date: string;
  peakLevel: number;
};

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      fields.push(field.trim());
      field = "";
    } else {
      field += char;
    }
  }

  fields.push(field.trim());
  return fields;
}

function parseCsv(csv: string): CsvRow[] {
  const lines = csv
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);

  if (lines.length < 2) {
    throw new Error("The CSV has no data rows.");
  }

  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row: CsvRow = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    return row;
  });
}

function round(value: number, decimals = 3): number {
  return Number(value.toFixed(decimals));
}

export async function GET() {
  try {
    const csvPath = path.join(
      process.cwd(),
      "data",
      "floodevents_indofloods.csv"
    );

    const csv = await readFile(csvPath, "utf8");
    const rows = parseCsv(csv);

   
    const observations: Observation[] = rows
      .map((row) => {
        const peakLevelText =
          row["Peak Flood Level (m)"]?.trim() ?? "";

        const date =
          row["Peak FL Date"]?.trim() ||
          row["Start Date"]?.trim() ||
          "";

        return {
          eventId: row["EventID"]?.trim() ?? "",
          date,
          peakLevel: peakLevelText === "" ? NaN : Number(peakLevelText),
        };
      })
      .filter((item) => {
        return (
          item.eventId.length > 0 &&
          /^\d{4}-\d{2}-\d{2}$/.test(item.date) &&
          Number.isFinite(Date.parse(item.date)) &&
          Number.isFinite(item.peakLevel)
        );
      })
      .sort((a, b) => {
        const dateOrder = a.date.localeCompare(b.date);
        return dateOrder || a.eventId.localeCompare(b.eventId);
      });

    // Only use dates that have usable peak-level observations.
    const uniqueDates = [...new Set(observations.map((item) => item.date))];

    if (uniqueDates.length < 2 || observations.length < 10) {
      return Response.json(
        {
          status: "insufficient_data",
          message:
            "Not enough dated peak-level observations are available for evaluation.",
          usableObservations: observations.length,
          distinctDates: uniqueDates.length,
        },
        { status: 422 }
      );
    }

    // Keep the latest 20% of distinct dates for testing.
    // Earlier dates are used to calculate the baseline prediction.
    const splitIndex = Math.max(
      1,
      Math.min(
        uniqueDates.length - 1,
        Math.floor(uniqueDates.length * 0.8)
      )
    );

    const cutoffDate = uniqueDates[splitIndex];

    const training = observations.filter(
      (item) => item.date < cutoffDate
    );

    const testing = observations.filter(
      (item) => item.date >= cutoffDate
    );

    if (training.length === 0 || testing.length === 0) {
      return Response.json(
        {
          status: "insufficient_data",
          message: "The chronological train/test split was empty.",
        },
        { status: 422 }
      );
    }

    // Baseline: predict every test event using the mean
    // peak level from earlier training events.
    const trainingMean =
      training.reduce((sum, item) => sum + item.peakLevel, 0) /
      training.length;

    const errors = testing.map(
      (item) => item.peakLevel - trainingMean
    );

    const mae =
      errors.reduce((sum, error) => sum + Math.abs(error), 0) /
      errors.length;

    const mse =
      errors.reduce((sum, error) => sum + error * error, 0) /
      errors.length;

    const actualMean =
      testing.reduce((sum, item) => sum + item.peakLevel, 0) /
      testing.length;

    const testSse = errors.reduce(
      (sum, error) => sum + error * error,
      0
    );

    const testSst = testing.reduce(
      (sum, item) =>
        sum + Math.pow(item.peakLevel - actualMean, 2),
      0
    );

    const r2 =
      testSst === 0 ? null : 1 - testSse / testSst;

    const sortedPeakLevels = observations
      .map((item) => item.peakLevel)
      .sort((a, b) => a - b);

    const maximumPeakLevel =
      sortedPeakLevels[sortedPeakLevels.length - 1];

    return Response.json({
      status: "evaluated",
      evaluationType: "historical_mean_regression_baseline",
      target: "Peak Flood Level (m)",
      predictionMethod:
        "Mean peak level from the training period, applied to every test event",
      split: {
        method: "chronological",
        trainingFraction: 0.8,
        cutoffDate,
        trainingStart: training[0].date,
        trainingEnd: training[training.length - 1].date,
        testingStart: testing[0].date,
        testingEnd: testing[testing.length - 1].date,
        trainingSamples: training.length,
        testingSamples: testing.length,
      },
      metrics: {
        mae: round(mae),
        rmse: round(Math.sqrt(mse)),
        r2: r2 === null ? null : round(r2),
        unit: "m",
      },
      baseline: {
        predictedPeakLevel: round(trainingMean),
        description:
          "A simple historical-mean reference, not a trained operational flood prediction model.",
      },
      dataQuality: {
        totalCsvRows: rows.length,
        usableObservations: observations.length,
        excludedObservations: rows.length - observations.length,
        distinctDates: uniqueDates.length,
        maximumRecordedPeakLevel: round(maximumPeakLevel),
        maximumValueNeedsSourceReview: maximumPeakLevel > 100,
        note:
          "The maximum is reported as recorded. Review unusual values and source units before interpreting metrics; no observations are silently removed.",
      },
      classificationMetrics: {
        accuracy: null,
        precision: null,
        recall: null,
        falseAlarmRate: null,
        status:
          "Unavailable: this evaluation measures continuous peak levels, not flood/no-flood classifications.",
      },
    });
  } catch (error) {
    console.error("Historical flood evaluation failed:", error);

    return Response.json(
      {
        status: "error",
        message:
          "Could not evaluate the historical flood dataset. Check that data/floodevents_indofloods.csv exists and is readable.",
      },
      { status: 500 }
    );
  }
}