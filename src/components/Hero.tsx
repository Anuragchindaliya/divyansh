import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-[400px] flex items-center justify-center bg-gradient-to-r from-pink-100 to-purple-100">
      <Card className="p-6 bg-white shadow-xl">
        <CardContent className="flex flex-col items-center">
          <Image
            src="https://instagram.fdel3-2.fna.fbcdn.net/v/t51.2885-19/522304575_17853231279489077_2617825540006212463_n.jpg?efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=instagram.fdel3-2.fna.fbcdn.net&_nc_cat=105&_nc_oc=Q6cZ2QHMrNykTen8FbakJA6Bgppf2A2v4oTmrFEKZDXOmn7A_3_647KiSSWllA34mtfvfQyOtiLpqQ-YxkYqOJ1Bb17I&_nc_ohc=OfTBB1nTdloQ7kNvwE8d6LO&_nc_gid=yU_mr2LQLXQCIHj1EeliEQ&edm=AP4sbd4BAAAA&ccb=7-5&oh=00_AfRYWn-NFBz4RVyn1FtjezwIR86kpWFHIKbpBnLp7FwJJQ&oe=6888398C&_nc_sid=7a9f4b"
            alt="Divyansh"
            width={120}
            height={120}
            className="rounded-full border-4 border-pink-400"
          />
          <h1 className="text-2xl mt-4 font-bold text-pink-600">Divyansh</h1>
          <p className="text-gray-500">9 months old | Baby Model</p>
        </CardContent>
      </Card>
    </section>
  );
}
