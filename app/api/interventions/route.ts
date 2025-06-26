import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const interventions = await prisma.intervention.findMany({
      include: {
        technicianUser: {
          select: {
            name: true,
            technicianId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(interventions);
  } catch (error) {
    console.error("Error fetching interventions:", error);
    return NextResponse.json(
      { error: "Failed to fetch interventions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      requestDate,
      requestedIntervention,
      arrivalAtWorkshop,
      department,
      requestedBy,
      returnToService,
      equipmentDescription,
      inventoryNumber,
      problemDescription,
      interventionType,
      datePerformed,
      tasksCompleted,
      partsReplaced,
      partDescription,
      price,
      technician,
      timeSpent,
      status,
      technicianId,
    } = body;

    // Validate required fields
    if (
      !requestDate ||
      !requestedIntervention ||
      !department ||
      !requestedBy ||
      !equipmentDescription
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create intervention
    const intervention = await prisma.intervention.create({
      data: {
        requestDate,
        requestedIntervention,
        arrivalAtWorkshop,
        department,
        requestedBy,
        returnToService,
        equipmentDescription,
        inventoryNumber: inventoryNumber || "",
        problemDescription: problemDescription || "",
        interventionType: interventionType || "Curative",
        datePerformed,
        tasksCompleted,
        partsReplaced,
        partDescription,
        price,
        technician,
        timeSpent,
        status: status || "Pending",
        technicianId,
      },
      include: {
        technicianUser: {
          select: {
            name: true,
            technicianId: true,
          },
        },
      },
    });

    return NextResponse.json(intervention, { status: 201 });
  } catch (error) {
    console.error("Error creating intervention:", error);
    return NextResponse.json(
      { error: "Failed to create intervention" },
      { status: 500 }
    );
  }
}
