import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const alerts = await prisma.alert.findMany({
      include: {
        machine: {
          select: {
            name: true,
            inventoryNumber: true,
            department: true,
          },
        },
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    return NextResponse.json(alerts);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return NextResponse.json(
      { error: "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      message,
      messageRole,
      type,
      requiredAction,
      priority,
      machineId,
      status,
    } = body;

    // Validate required fields
    if (!message || !type || !requiredAction || !priority || !machineId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create alert
    const alert = await prisma.alert.create({
      data: {
        message,
        messageRole: messageRole || "",
        type,
        requiredAction,
        priority,
        timestamp: new Date(),
        status: status || "active",
        machineId,
      },
      include: {
        machine: {
          select: {
            name: true,
            inventoryNumber: true,
            department: true,
          },
        },
      },
    });

    return NextResponse.json(alert, { status: 201 });
  } catch (error) {
    console.error("Error creating alert:", error);
    return NextResponse.json(
      { error: "Failed to create alert" },
      { status: 500 }
    );
  }
}
