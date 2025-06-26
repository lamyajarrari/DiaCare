import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const machines = await prisma.machine.findMany({
      include: {
        _count: {
          select: {
            faults: true,
            alerts: true,
            maintenanceSchedule: true,
          },
        },
      },
    });

    return NextResponse.json(machines);
  } catch (error) {
    console.error("Error fetching machines:", error);
    return NextResponse.json(
      { error: "Failed to fetch machines" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      inventoryNumber,
      department,
      status,
      lastMaintenance,
      nextMaintenance,
    } = body;

    // Validate required fields
    if (!id || !name || !inventoryNumber || !department) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create machine
    const machine = await prisma.machine.create({
      data: {
        id,
        name,
        inventoryNumber,
        department,
        status: status || "Active",
        lastMaintenance: lastMaintenance ? new Date(lastMaintenance) : null,
        nextMaintenance: nextMaintenance ? new Date(nextMaintenance) : null,
      },
    });

    return NextResponse.json(machine, { status: 201 });
  } catch (error) {
    console.error("Error creating machine:", error);
    return NextResponse.json(
      { error: "Failed to create machine" },
      { status: 500 }
    );
  }
}
