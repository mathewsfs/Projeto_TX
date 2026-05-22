"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAppointments() {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { date: "asc" },
    });
    return { success: true, data: appointments };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createAppointment(data: {
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  date: Date;
  serviceType: string;
  notes?: string;
}) {
  try {
    const appointment = await prisma.appointment.create({
      data: {
        ...data,
      },
    });
    
    revalidatePath("/dashboard");
    return { success: true, data: appointment };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateAppointmentStatus(id: string, status: "PENDING" | "CONFIRMED" | "CANCELED" | "RESCHEDULED") {
  try {
    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
    });
    
    revalidatePath("/dashboard");
    return { success: true, data: appointment };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
