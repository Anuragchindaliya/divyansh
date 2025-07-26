import Image from "next/image";

const images = [
  "https://instagram.fdel3-2.fna.fbcdn.net/v/t51.2885-15/516653393_17851469490489077_5931413653051124081_n.webp?stp=dst-webp_p480x480&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0uaW1hZ2VfdXJsZ2VuLjE0NDB4MTkyMC5zZHIuZjgyNzg3LmRlZmF1bHRfaW1hZ2UuYzIifQ&_nc_ht=instagram.fdel3-2.fna.fbcdn.net&_nc_cat=105&_nc_oc=Q6cZ2QHMrNykTen8FbakJA6Bgppf2A2v4oTmrFEKZDXOmn7A_3_647KiSSWllA34mtfvfQyOtiLpqQ-YxkYqOJ1Bb17I&_nc_ohc=4fYzo6AFXMkQ7kNvwF4uoIZ&_nc_gid=yU_mr2LQLXQCIHj1EeliEQ&edm=AP4sbd4BAAAA&ccb=7-5&ig_cache_key=MzY3MDUxOTM5Mzc3NzY4MTQ2NQ%3D%3D.3-ccb7-5&oh=00_AfT9l03138EzX9rswDJ4UMp9jbQi9RUNxnYUNp4P0KJJYg&oe=6888282B&_nc_sid=7a9f4b",
  "https://instagram.fdel3-2.fna.fbcdn.net/v/t51.2885-15/504472639_17847745338489077_7035838776740750305_n.webp?efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0uaW1hZ2VfdXJsZ2VuLjE0NDB4MTgwMC5zZHIuZjc1NzYxLmRlZmF1bHRfaW1hZ2UuYzIifQ&_nc_ht=instagram.fdel3-2.fna.fbcdn.net&_nc_cat=105&_nc_oc=Q6cZ2QHMrNykTen8FbakJA6Bgppf2A2v4oTmrFEKZDXOmn7A_3_647KiSSWllA34mtfvfQyOtiLpqQ-YxkYqOJ1Bb17I&_nc_ohc=eDmQie1c9-UQ7kNvwGDmPhm&_nc_gid=yU_mr2LQLXQCIHj1EeliEQ&edm=AP4sbd4BAAAA&ccb=7-5&ig_cache_key=MzY0OTUzMzg5MTUwMzM5NTYzOA%3D%3D.3-ccb7-5&oh=00_AfTtI0dOzl9bDVvjUaUQb11yT5Tw5DM8A8k6XuicGXwU9g&oe=688823DA&_nc_sid=7a9f4b",
  "https://instagram.fdel3-2.fna.fbcdn.net/v/t51.2885-15/502709352_17846637945489077_6067668722932756919_n.webp?efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0uaW1hZ2VfdXJsZ2VuLjE0NDB4MTgwMC5zZHIuZjc1NzYxLmRlZmF1bHRfaW1hZ2UuYzIifQ&_nc_ht=instagram.fdel3-2.fna.fbcdn.net&_nc_cat=105&_nc_oc=Q6cZ2QHMrNykTen8FbakJA6Bgppf2A2v4oTmrFEKZDXOmn7A_3_647KiSSWllA34mtfvfQyOtiLpqQ-YxkYqOJ1Bb17I&_nc_ohc=KWl2upgGYW4Q7kNvwHJyyf4&_nc_gid=yU_mr2LQLXQCIHj1EeliEQ&edm=AP4sbd4BAAAA&ccb=7-5&ig_cache_key=MzY0NDcxNDU3MjQxMTg2ODYwNw%3D%3D.3-ccb7-5&oh=00_AfRdSLQRYcpUvIp6xdwU2KK_wUxqSUiQvPYPLHrlgQJafQ&oe=68885A2D&_nc_sid=7a9f4b",
  "https://instagram.fdel3-2.fna.fbcdn.net/v/t51.2885-15/524229557_17853846027489077_4826972880702059334_n.webp?efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0uaW1hZ2VfdXJsZ2VuLjE0NDB4MTkyMC5zZHIuZjgyNzg3LmRlZmF1bHRfaW1hZ2UuYzIifQ&_nc_ht=instagram.fdel10-2.fna.fbcdn.net&_nc_cat=105&_nc_oc=Q6cZ2QEe0syD5ZbpwA9ES7PgiOQZuJd3eLZ1c3hu_dsD6EYK7LQb7bg5h9uM-STnqbQbY1o&_nc_ohc=1-snpO4p4JAQ7kNvwHp7pdB&_nc_gid=6LHWBJ95GP9RWIhiDsdA2w&edm=AP4sbd4BAAAA&ccb=7-5&ig_cache_key=MzY4NDU4OTg3NjM2NjA0NDg1Mw%3D%3D.3-ccb7-5&oh=00_AfS7TqabmNH9kAGHDG0UxyyHhAs0PKvPQ1P_NtTpiGdWcg&oe=688AA55D&_nc_sid=7a9f4b",
];

export default function Gallery() {
  return (
    <section className="py-10 px-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-pink-600">
        Gallery
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((src, idx) => (
          <Image
            key={idx}
            src={src}
            alt={`Divyansh ${idx}`}
            width={300}
            height={300}
            className="rounded-lg object-cover"
          />
        ))}
      </div>
    </section>
  );
}
