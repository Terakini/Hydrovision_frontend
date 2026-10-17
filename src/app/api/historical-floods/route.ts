
import { NextResponse } from "next/server";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

type CsvRow = Record<string, string>;

function parseCsv(text: string): CsvRow[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '"') {
      if (quoted && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);

      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (cell.length || row.length) {
    row.push(cell);
    if (row.some((value) => value.trim() !== "")) rows.push(row);
  }

  if (quoted || rows.length < 2) return [];

  const headers = rows[0].map((header) =>
    header.trim().replace(/^\uFEFF/, "")
  );

  return rows.slice(1).map((values) => {
    const record: CsvRow = {};
    headers.forEach((header, index) => {
      record[header] = (values[index] ?? "").trim();
    });
    return record;
  });
}

function numeric(value: string | undefined): number | null {
  if (!value?.trim()) return null;
  const result = Number(value);
  return Number.isFinite(result) ? result : null;
}

function validDate(value: string | undefined): string | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const date = new Date(`${value}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    return null;
  }

  return value;
}

export async function GET() {
  const filePath = path.join(
    process.cwd(),
    "data",
    "floodevents_indofloods.csv"
  );

  try {
    const [csv, fileInfo] = await Promise.all([
      readFile(filePath, "utf8"),
      stat(filePath),
    ]);

    const rows = parseCsv(csv);

    if (rows.length === 0) {
      return NextResponse.json(
        {
          message: "The CSV is empty or could not be parsed.",
          datasetAvailable: true,
          schemaValid: false,
        },
        { status: 422 }
      );
    }

    const requiredColumns = [
      "EventID",
      "Start Date",
      "End Date",
      "Peak Flood Level (m)",
      "Event Duration (days)",
      "Flood Type",
    ];

    const availableColumns = Object.keys(rows[0]);
    const missingColumns = requiredColumns.filter(
      (column) => !availableColumns.includes(column)
    );

    if (missingColumns.length > 0) {
      return NextResponse.json(
        {
          message: "The CSV does not match the expected INDOFLOODS schema.",
          datasetAvailable: true,
          schemaValid: false,
          missingColumns,
          columns: availableColumns,
          recordCount: rows.length,
        },
        { status: 422 }
      );
    }

    const floodCount = rows.filter(
      (row) => row["Flood Type"].toLowerCase() === "flood"
    ).length;

    const severeCount = rows.filter(
      (row) => row["Flood Type"].toLowerCase() === "severe flood"
    ).length;

    const durations = rows
      .map((row) => numeric(row["Event Duration (days)"]))
      .filter((value): value is number => value !== null && value >= 0);

    const peakLevels = rows
      .map((row) => numeric(row["Peak Flood Level (m)"]))
      .filter((value): value is number => value !== null);

    const startDates = rows
      .map((row) => validDate(row["Start Date"]))
      .filter((value): value is string => value !== null)
      .sort();

    const endDates = rows
      .map((row) => validDate(row["End Date"]))
      .filter((value): value is string => value !== null)
      .sort();

    const missingValues = {
      eventId: rows.filter((row) => !row["EventID"]).length,
      startDate: rows.filter((row) => !validDate(row["Start Date"])).length,
      endDate: rows.filter((row) => !validDate(row["End Date"])).length,
      floodType: rows.filter((row) => !row["Flood Type"]).length,
      peakLevel: rows.filter(
        (row) => numeric(row["Peak Flood Level (m)"]) === null
      ).length,
      duration: rows.filter(
        (row) => numeric(row["Event Duration (days)"]) === null
      ).length,
      discharge: rows.filter(
        (row) => numeric(row["Peak Discharge Q (cumec)"]) === null
      ).length,
      floodVolume: rows.filter(
        (row) => numeric(row["Flood Volume (cumec)"]) === null
      ).length,
    };

    const knownTypes = new Set(["flood", "severe flood"]);
    const otherTypeCount = rows.filter(
      (row) => !knownTypes.has(row["Flood Type"].toLowerCase())
    ).length;

    const eventIds = rows
      .map((row) => row["EventID"])
      .filter(Boolean);

    const duplicateEventIds = eventIds.length - new Set(eventIds).size;

    const maximumRecordedPeakLevel =
      peakLevels.length > 0 ? Math.max(...peakLevels) : null;

    return NextResponse.json({
      source: "INDOFLOODS",
      file: "data/floodevents_indofloods.csv",
      datasetAvailable: true,
      schemaValid: true,
      loadedAt: new Date().toISOString(),
      fileModifiedAt: fileInfo.mtime.toISOString(),
      fileSizeBytes: fileInfo.size,

      recordCount: rows.length,
      floodCount,
      severeCount,
      otherTypeCount,

      startDate: startDates[0] ?? null,
      endDate: endDates.length > 0 ? endDates[endDates.length - 1] : null,
      dateRange: {
        start: startDates[0] ?? null,
        end: endDates.length > 0 ? endDates[endDates.length - 1] : null,
        min: startDates[0] ?? null,
        max: endDates.length > 0 ? endDates[endDates.length - 1] : null,
      },

      averageDuration:
        durations.length > 0
          ? Number(
              (
                durations.reduce((sum, value) => sum + value, 0) /
                durations.length
              ).toFixed(2)
            )
          : null,

      maxPeakLevel: maximumRecordedPeakLevel,
      maximumRecordedPeakLevel,
      maximumValueNeedsSourceReview:
        maximumRecordedPeakLevel !== null &&
        maximumRecordedPeakLevel > 100,

      duplicateEventIds,
      missingValues,
      missingColumns: [],
      columns: availableColumns,
    });
  } catch (error) {
    console.error("Historical flood dataset error:", error);

    return NextResponse.json(
      {
        message:
          "Could not read the INDOFLOODS CSV. Check that data/floodevents_indofloods.csv exists.",
        datasetAvailable: false,
        schemaValid: false,
      },
      { status: 500 }
    );
  }
}
