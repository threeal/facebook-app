import { FastifyInstance } from "fastify";
import type { PostSchema } from "shared";

export default function (fastify: FastifyInstance) {
  fastify.get("/api/posts", (): PostSchema[] => {
    const amiraHassan = {
      name: "Amira Hasan",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    };

    const budiSantoso = {
      name: "Budi Santoso",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    };

    const sitiNurhaliza = {
      name: "Siti Nurhaliza",
      avatar:
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop&crop=face",
    };

    const ranggaPratama = {
      name: "Rangga Pratama",
      avatar:
        "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=100&h=100&fit=crop&crop=face",
    };

    return [
      {
        author: amiraHassan,
        caption: "Hari ini cuacanya cerah banget! ☀️",
        image:
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&h=400&fit=crop",
        reactions: 3,
        date: "15 Jun",
      },
      {
        author: budiSantoso,
        caption: "Selamat pagi dunia!",
        date: "2 Mar 2024",
      },
      {
        author: sitiNurhaliza,
        video:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        caption: "Video lucu yang bikin ngakak! 😂",
        reactions: 8,
        date: "29 Apr 2024",
      },
      {
        author: ranggaPratama,
        caption:
          "Akhirnya bisa liburan juga setelah sekian lama nggak ke luar kota. Suasana pegunungan memang nggak pernah gagal bikin hati tenang dan pikiran fresh.",
        image:
          "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=500&h=400&fit=crop",
        reactions: 1,
        date: "10 Des 2023",
      },
      {
        author: amiraHassan,
        image:
          "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=400&fit=crop",
        reactions: 20,
        date: "7 Mei",
      },
      {
        author: budiSantoso,
        caption: "Ngopi dulu biar waras ☕️",
        reactions: 2,
        date: "30 Jan 2023",
      },
      {
        author: sitiNurhaliza,
        caption:
          "Terima kasih atas semua dukungan teman-teman selama ini. Hari ini aku resmi lulus! 🎓",
        image:
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=400&fit=crop",
        date: "21 Jul 2024",
      },
      {
        author: ranggaPratama,
        image:
          "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=500&h=400&fit=crop",
        reactions: 5,
        date: "28 Feb",
      },
      {
        author: amiraHassan,
        caption: "Baca buku sambil hujan itu combo terbaik. 📖🌧️",
        date: "13 Okt 2023",
      },
      {
        author: budiSantoso,
        caption:
          "Senja di pantai selalu memberikan rasa damai. Nggak perlu kata-kata, cukup duduk dan menikmati setiap detiknya.",
        image:
          "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500&h=400&fit=crop",
        reactions: 50,
        date: "5 Sep 2024",
      },
      {
        author: sitiNurhaliza,
        caption: "Masakan rumah memang selalu juara! 🍲",
        reactions: 12,
        date: "18 Agu",
      },
      {
        author: ranggaPratama,
        caption:
          "Proyek baru, tantangan baru! Semoga semua berjalan lancar sampai akhir.",
        reactions: 1,
        date: "12 Nov 2023",
      },
      {
        author: amiraHassan,
        image:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=400&fit=crop",
        date: "1 Jan 2025",
      },
      {
        author: budiSantoso,
        caption: "Ayo semangat mulai minggu baru! 💪",
        reactions: 2,
        date: "4 Mar",
      },
      {
        author: sitiNurhaliza,
        caption: "Pelangi setelah hujan 🌈",
        image:
          "https://images.unsplash.com/photo-1535914254981-b5012eebbd15?w=500&h=400&fit=crop",
        date: "22 Feb 2025",
      },
    ];
  });
}
