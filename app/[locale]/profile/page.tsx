import { getDictionary, Locale } from "@/i18n/get-dictionary";
import ProfileContainer from "@/components/profile/ProfileContainer";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: `${dict.profile.title} | ${dict.cv.name}`,
    description: dict.profile.hero.bio,
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <ProfileContainer locale={locale} dict={dict} />
  );
}
