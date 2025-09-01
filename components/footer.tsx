export default function Footer() {
  return (
    <footer className="relative w-full  py-20 px-4 mt-[600px] z-[1] bg-gradient-to-t from-white via-white/60 to-transparent">
      <div className="absolute overflow-x-clip inset-0 w-full h-full">
        <div className="absolute bottom-0 left-1/4 w-52 md:w-96 h-52 md:h-96 bg-gradient-to-r from-indigo-400/30 to-blue-400/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/30 to-orange-400/30 rounded-full blur-3xl"></div>
      </div>
      <h2 className="text-8xl md:text-9xl font-aspekta text-center w-full absolute -bottom-8 lg:text-[12rem] xl:text-[18.8rem] font-black bg-gradient-to-t from-white/80 via-black/20 inset-x-0 to-transparent bg-clip-text text-transparent leading-none tracking-tighter">
        Endless <br className="flex lg:hidden" /> WTF's
      </h2>
    </footer>
  );
}
