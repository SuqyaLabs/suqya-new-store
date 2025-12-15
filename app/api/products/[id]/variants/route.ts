import { NextRequest, NextResponse } from "next/server";
import { getTranslatedVariants } from "@/lib/i18n/translations";
import { DEFAULT_LANGUAGE, type LanguageCode } from "@/lib/i18n/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const locale = (searchParams.get("locale") as LanguageCode) || DEFAULT_LANGUAGE;

    const variants = await getTranslatedVariants(id, locale);

    return NextResponse.json({ variants });
  } catch (error) {
    console.error("Variants API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
