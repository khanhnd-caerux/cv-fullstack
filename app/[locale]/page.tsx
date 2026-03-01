import { getDictionary, Locale } from "@/i18n/get-dictionary";
import CVTemplate from "@/components/CVTemplate";

export default async function Page({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <CVTemplate locale={locale} dict={dict} />
  );
}
