"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function createJewelryItem(formData: FormData) {
  try {
    const code = formData.get("code") as string;
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const material = formData.get("material") as string;
    const stones = formData.get("stones") as string;
    const costValue = parseFloat(formData.get("costValue") as string);
    const photo = formData.get("photo") as File | null;

    let images: string[] = [];

    if (photo && photo.size > 0) {
      const buffer = Buffer.from(await photo.arrayBuffer());
      const ext = path.extname(photo.name);
      const filename = `${crypto.randomBytes(16).toString("hex")}${ext}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (err) {}
      
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
      
      images.push(`/uploads/${filename}`);
    }

    const item = await prisma.jewelryItem.create({
      data: {
        code,
        name,
        type,
        material,
        stones,
        costValue: isNaN(costValue) ? 0 : costValue,
        images,
      },
    });
    
    revalidatePath("/dashboard/estoque");
    return { success: true, data: item };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "Já existe uma peça com este código SKU." };
    }
    return { success: false, error: error.message };
  }
}
