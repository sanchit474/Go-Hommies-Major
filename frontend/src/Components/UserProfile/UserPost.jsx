const UserPost = () => {

  const message = `Oye Priyanshu!
Kya haal-chaal? Thoda nautanki to tum ho hi, par isi wajah se sab yaad rakhte hain tumhe 😄

Chalo bhai, ab post karne ka time aa gaya hai!
Idea tumhare paas ho ya na ho, confidence hamesha full rehta hai — isi liye tum kuch bhi kar sakte ho.`;

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 space-y-6">
      <div className="bg-[#1a1a1a] p-6 rounded-lg max-w-3xl w-full text-sm sm:text-base text-white whitespace-pre-wrap leading-relaxed shadow-md">
        {message}
      </div>
    </div>
  );
};

export default UserPost;
