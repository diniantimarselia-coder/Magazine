import React, { forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PageProps {
  children: React.ReactNode;
  number: number;
  hideNumber?: boolean;
}

const Page = forwardRef<HTMLDivElement, PageProps>((props, ref) => {
  const isLeft = props.number % 2 === 0;
  return (
    <div className="bg-white shadow-2xl overflow-hidden relative group/page" ref={ref} data-density="hard">
      {/* Spine Shadow */}
      <div className={`absolute top-0 bottom-0 w-8 z-20 pointer-events-none opacity-20 ${isLeft ? 'right-0 bg-gradient-to-l from-black/30 to-transparent' : 'left-0 bg-gradient-to-r from-black/30 to-transparent'}`}></div>
      
      <div className="h-full w-full flex flex-col relative z-10">
        {props.children}
        {!props.hideNumber && (
          <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-gray-300 font-mono tracking-widest group-hover/page:text-blue-400 transition-colors">
            — {props.number} —
          </div>
        )}
      </div>
    </div>
  );
});

const Tooltip = ({ children, text }: { children: React.ReactNode, text: string }) => (
  <span className="relative group/tooltip inline-block cursor-help">
    <span className="border-b border-dotted border-blue-500 text-blue-600 font-bold">{children}</span>
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-[9px] rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-[100] w-40 text-center shadow-xl font-sans normal-case tracking-normal leading-tight">
      {text}
      <span className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900"></span>
    </span>
  </span>
);

Page.displayName = 'Page';

export default function Magazine() {
  const bookRef = React.useRef<any>(null);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [isPortrait, setIsPortrait] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [dimensions, setDimensions] = React.useState({ width: 550, height: 750 });

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsPortrait(width < 768);
      
      if (width < 480) {
        setDimensions({ width: width - 40, height: (width - 40) * 1.4 });
      } else if (width < 768) {
        setDimensions({ width: width - 80, height: (width - 80) * 1.3 });
      } else {
        setDimensions({ width: 550, height: 750 });
      }
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextButtonClick();
      if (e.key === 'ArrowLeft') prevButtonClick();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const onPage = (e: any) => {
    setCurrentPage(e.data);
  };

  const nextButtonClick = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const prevButtonClick = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  const jumpToPage = (pageIndex: number) => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flip(pageIndex);
    }
  };

  const totalPages = 15;

  return (
    <div className="min-h-screen bg-[#08080c] flex flex-col items-center justify-center p-4 md:p-8 font-sans overflow-x-hidden selection:bg-blue-500/30">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-6xl flex flex-col items-center"
      >
        {/* Lightbox Modal */}
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative max-w-5xl w-full h-full flex items-center justify-center"
            >
              <img 
                src={selectedImage} 
                className="max-w-full max-h-full object-contain shadow-2xl rounded-lg" 
                alt="Enlarged view" 
                referrerPolicy="no-referrer"
              />
              <button 
                className="absolute top-4 right-4 text-white/50 hover:text-white p-2 bg-white/10 rounded-full transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                <ChevronRight size={24} className="rotate-45" />
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Header - Minimalist & Techy */}
        <div className="w-full flex justify-between items-end mb-10 text-white border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-blue-600 flex items-center justify-center font-black text-2xl italic skew-x-[-12deg] shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">D</div>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Digital Insight</h1>
              <p className="text-[10px] text-blue-400 tracking-[0.3em] uppercase font-bold mt-1.5">Digital Innovation Journal</p>
            </div>
          </div>
          <div className="hidden md:block text-right space-y-1">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Universitas Muhammadiyah Prof. Dr. HAMKA — Teknik Informatika</p>
            <p className="text-[10px] text-blue-500 uppercase tracking-[0.2em] font-bold">Edisi 01 / April 2026</p>
          </div>
        </div>

        {/* Flipbook Container */}
        <div className="relative group">
          {/* Decorative Elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* @ts-ignore */}
          <HTMLFlipBook
            width={dimensions.width}
            height={dimensions.height}
            size="stretch"
            minWidth={280}
            maxWidth={1000}
            minHeight={400}
            maxHeight={1533}
            maxShadowOpacity={0.3}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={onPage}
            className="shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rounded-sm overflow-hidden"
            ref={bookRef}
            style={{ margin: '0 auto' }}
            startPage={0}
            drawShadow={true}
            flippingTime={1000}
            usePortrait={isPortrait}
            startZIndex={0}
            autoSize={true}
            clickEventForward={true}
            useMouseEvents={true}
            swipeDistance={30}
            showPageCorners={true}
            disableFlipByClick={false}
          >
            {/* Page 1: Cover - Urban/Editorial Style */}
            <Page number={1} hideNumber={true}>
              <div className="h-full relative overflow-hidden border-[12px] border-[#1a3a3a] bg-gray-200">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 z-0 cursor-zoom-in"
                  onClick={() => setSelectedImage("https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop")}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop" 
                    alt="Tech Background" 
                    className="w-full h-full object-cover brightness-75 contrast-125"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 h-full p-8 flex flex-col justify-between">
                  {/* Top Title */}
                  <div className="mt-4">
                    <h1 className="text-3xl md:text-4xl font-sans font-black text-white tracking-tighter drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] leading-none">
                      Digital<br/>Insight<br/>
                      <span className="text-base md:text-lg text-[#ffd700] tracking-[0.2em] uppercase mt-2 block">— Edisi 1</span>
                    </h1>
                  </div>

                  {/* Middle Section */}
                  <div className="flex flex-col items-start gap-6">
                    {/* Main Headline */}
                    <div className="space-y-0">
                      <h2 className="text-xl md:text-2xl font-black text-[#ffd700] leading-[0.9] tracking-tight drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase italic">
                        Dari Ngoding<br/>ke Solusi:
                      </h2>
                      <h3 className="text-lg md:text-xl font-black text-white leading-none tracking-tight drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase italic mt-2">
                        Perjalanan<br/>Mahasiswa TI
                      </h3>
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className="flex justify-between items-end">
                    <div className="max-w-[70%] space-y-4">
                      <div className="space-y-1">
                        <p className="text-[8px] font-black text-white uppercase tracking-widest">Featured Articles:</p>
                        <div className="space-y-0.5">
                          <p className="text-[7px] font-bold text-white uppercase leading-tight">Program Studi Teknik Informatika</p>
                          <p className="text-[7px] font-bold text-white uppercase leading-tight">Fakultas Teknologi Industri dan Informatika</p>
                          <p className="text-[7px] font-black text-[#ffd700] uppercase leading-tight">Universitas Muhammadiyah Prof. Dr. HAMKA</p>
                        </div>
                      </div>
                      <p className="text-[9px] italic font-bold text-white leading-tight border-l-2 border-[#ffd700] pl-3">
                        “Eksplorasi teknologi dari sudut pandang mahasiswa.”
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-[10px] font-black text-white tracking-tighter">APRIL 2026</p>
                    </div>
                  </div>
                  
                  {/* Click to Flip Hint */}
                  <motion.div 
                    animate={{ x: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 text-white/40 pointer-events-none"
                  >
                    <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/40 to-transparent"></div>
                    <p className="text-[8px] uppercase tracking-[0.3em] vertical-text font-bold">Click to Flip</p>
                    <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/40 to-transparent"></div>
                  </motion.div>
                </div>

                {/* Subtle Texture Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>
              </div>
            </Page>

            {/* Page 2: Table of Contents - Clean & Structured */}
            <Page number={2}>
              <div className="p-6 md:p-12 pr-6 md:pr-12 h-full flex flex-col bg-[#fafafa] overflow-y-auto relative">
                <div className="mb-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#004a99] mb-4 flex items-center gap-3">
                    <span className="w-12 h-[2px] bg-[#004a99]"></span> Contents
                  </h3>
                  <h2 className="text-2xl md:text-3xl font-serif font-black uppercase tracking-tighter text-gray-900">Daftar Isi</h2>
                </div>
                
                <div className="flex-1 space-y-3">
                  {[
                    { page: '03', title: 'Dari Redaksi', category: 'Editorial' },
                    { page: '04', title: 'Peran AI dalam Solusi Mahasiswa', category: 'Artikel Utama 1' },
                    { page: '06', title: 'IoT dalam Aktivitas Kampus', category: 'Artikel Utama 2' },
                    { page: '08', title: 'Dari Ide ke Aksi: Smart Parking', category: 'Feature Utama' },
                    { page: '10', title: 'Machine Learning: Masa Depan Data', category: 'Rubrik Prodi' },
                    { page: '11', title: 'Langkah Kecil Menuju Inovasi', category: 'Tips' },
                    { page: '12', title: 'Proses Redaksi', category: 'Workflow' },
                    { page: '13', title: 'Kesimpulan', category: 'Closing' },
                    { page: '14', title: 'Tim Redaksi', category: 'Credits' },
                    { page: '15', title: 'Referensi', category: 'References' },
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center group cursor-pointer"
                      onClick={() => jumpToPage(parseInt(item.page) - 1)}
                    >
                      <span className="text-xl font-black font-mono mr-6 text-blue-100 group-hover:text-blue-600 transition-all duration-300 transform group-hover:scale-110">{item.page}</span>
                      <div className="flex-1 border-b border-gray-200 pb-1.5 group-hover:border-blue-400 transition-colors">
                        <div className="flex justify-between items-end gap-4">
                          <p className="text-[10px] font-black uppercase tracking-tight text-gray-800 group-hover:text-blue-600 transition-colors">{item.title}</p>
                          <p className="text-[7px] text-gray-400 uppercase tracking-widest font-bold mb-0.5 whitespace-nowrap">{item.category}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-10 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-900 text-white flex items-center justify-center font-bold italic">T</div>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest leading-relaxed max-w-[200px]">
                      Jurnal Inovasi Mahasiswa Teknik Informatika Universitas Muhammadiyah Prof. Dr. HAMKA. Edisi Perdana.
                    </p>
                  </div>
                </div>
              </div>
            </Page>

            {/* Page 3: Dari Redaksi - Elegant Editorial */}
            <Page number={3}>
              <div className="p-6 md:p-12 pl-12 md:pl-24 h-full flex flex-col bg-white overflow-y-auto">
                <div className="mb-12">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Editorial</p>
                  <h2 className="text-2xl md:text-3xl font-serif italic text-gray-900 leading-tight">Dari Redaksi</h2>
                </div>
                
                <div className="flex-1 relative">
                  <div className="absolute -left-6 top-0 text-8xl font-serif text-blue-50 opacity-50 select-none">“</div>
                  <div className="space-y-6 text-gray-700 leading-relaxed text-sm relative z-10">
                    <p className="text-lg font-medium text-gray-900 leading-snug mb-8">
                      Halo, pembaca Digital Insight!
                    </p>
                    <p className="first-letter:text-5xl first-letter:font-black first-letter:text-blue-600 first-letter:float-left first-letter:mr-4 first-letter:mt-2 first-letter:leading-none">
                      Di era digital ini, mahasiswa Teknik Informatika tidak hanya belajar teori, tetapi juga mulai mengembangkan solusi nyata untuk masalah sehari-hari di kampus. Dari tugas kuliah sederhana hingga proyek mini, semuanya menjadi bagian dari proses belajar yang nyata dan kreatif.
                    </p>
                    <p>
                      Majalah ini menyoroti bagaimana teknologi seperti <Tooltip text="Kecerdasan buatan yang meniru kemampuan kognitif manusia">Artificial Intelligence</Tooltip> (AI), <Tooltip text="Jaringan perangkat fisik yang terhubung ke internet">Internet of Things</Tooltip> (IoT), dan <Tooltip text="Cabang AI yang fokus pada pengembangan algoritma yang belajar dari data">Machine Learning</Tooltip> digunakan mahasiswa sebagai alat untuk inovasi. Walaupun masih tahap awal, pengalaman ini memberi gambaran nyata tentang penerapan teknologi di lingkungan kampus.
                    </p>
                    <p>
                      Selain itu, Digital Insight menjadi bentuk kontribusi mahasiswa dalam literasi digital dan kreativitas. Semoga edisi ini memberi inspirasi dan mendorong semangat untuk terus mencoba, berinovasi, dan berkolaborasi.
                    </p>
                    <p className="font-serif italic text-gray-900 border-l-4 border-blue-600 pl-4 py-2 bg-blue-50/50">
                      “Inovasi tidak selalu dimulai dari ide besar, tetapi dari keberanian mencoba hal kecil.”
                    </p>
                  </div>
                </div>

                <div className="mt-12 pt-10 border-t border-gray-100 flex justify-between items-end">
                  <div>
                    <p className="font-serif italic text-2xl text-gray-900">Salam Hangat,</p>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-blue-600 font-black mt-2">Tim Redaksi Digital Insight</p>
                  </div>
                  <div className="text-[8px] text-gray-300 font-mono">TI-UHAMKA-2026</div>
                </div>
              </div>
            </Page>

            {/* Page 4: AI Article 1 - Left Spread */}
            <Page number={4}>
              <div className="h-full bg-white text-gray-900 p-4 md:p-8 pr-12 md:pr-24 flex flex-col relative overflow-y-auto border-r border-gray-100">
                <div className="flex gap-6 mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-serif font-black uppercase tracking-tight leading-tight mb-2">
                      Peran AI<br/>
                      <span className="text-blue-600">dalam Solusi</span><br/>
                      Mahasiswa
                    </h2>
                  </div>
                  <div className="w-1/3 pt-1">
                    <p className="text-[7px] leading-relaxed text-gray-400 mt-2">
                      Artificial Intelligence (AI) kini semakin dekat dengan mahasiswa. Di kampus Teknik Informatika, AI digunakan sebagai alat bantu memecahkan masalah sehari-hari.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 flex-1">
                  <div className="flex-1 space-y-2 text-[8px] leading-relaxed text-gray-600 columns-2 gap-4 break-words hyphens-auto">
                    <p className="font-bold text-gray-900 text-[9px] mb-1">Pemanfaatan AI di Kampus</p>
                    <p>
                      Salah satu contohnya adalah <Tooltip text="Program komputer yang dirancang untuk mensimulasikan percakapan">chatbot</Tooltip> akademik yang membantu menjawab pertanyaan tentang jadwal kuliah, informasi dosen, hingga pengumuman kampus. Dengan adanya sistem ini, akses informasi menjadi lebih cepat dan efisien bagi seluruh civitas akademika.
                    </p>
                    <p>
                      Mahasiswa juga mencoba <Tooltip text="Cabang AI yang fokus pada pengembangan algoritma yang belajar dari data">Machine Learning</Tooltip> untuk menganalisis data sederhana, seperti prediksi nilai atau pengelompokan data akademik. Proses ini menuntut mereka belajar coding, memahami algoritma, dan melakukan trial & error secara intensif.
                    </p>
                    <div className="bg-blue-50 p-2 border-l-4 border-blue-600 my-1 break-inside-avoid">
                      <p className="text-[8px] font-bold text-blue-800 uppercase mb-0.5">⚠️ Tantangan Belajar</p>
                      <p className="text-[7px] italic text-blue-700">Kesalahan coding, error sistem, dan keterbatasan data menjadi bagian penting untuk memahami AI secara nyata.</p>
                    </div>
                  </div>
                  <div 
                    className="w-[140px] h-[180px] bg-gray-100 rounded-sm overflow-hidden shadow-lg relative flex-shrink-0 mt-2 cursor-zoom-in"
                    onClick={() => setSelectedImage("https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop")}
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=500&auto=format&fit=crop" 
                      alt="AI Tech" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 border-[6px] border-white/20"></div>
                  </div>
                </div>
              </div>
            </Page>

            {/* Page 5: AI Article 2 - Right Spread */}
            <Page number={5}>
              <div className="p-0 h-full flex flex-col bg-white overflow-y-auto">
                <div 
                  className="h-28 w-full overflow-hidden relative cursor-zoom-in"
                  onClick={() => setSelectedImage("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop")}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop" 
                    alt="AI Visual" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-blue-900/20"></div>
                </div>
                
                <div className="p-4 md:p-8 pl-12 md:pl-24 flex-1 flex flex-col">
                  <h2 className="text-xl md:text-2xl font-serif font-black uppercase tracking-tight text-gray-900 mb-4 border-b-2 border-gray-100 pb-2">
                    Impact on Learning Process
                  </h2>

                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <div className="inline-block bg-blue-600 text-white px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest mb-3 shadow-md">Problem Solving</div>
                      <div className="space-y-2 text-[8px] leading-relaxed text-gray-600">
                        <p className="font-bold text-gray-900">1. ALAT BANTU NYATA</p>
                        <p>
                          Teknologi hanyalah alat, yang membuatnya berarti adalah cara kita menggunakannya untuk memecahkan masalah nyata.
                        </p>
                        <p className="font-bold text-gray-900">2. PROSES BELAJAR</p>
                        <p>
                          Tantangan yang muncul bukan penghalang, melainkan pengalaman belajar yang mendewasakan kemampuan teknis mahasiswa.
                        </p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="inline-block bg-emerald-600 text-white px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest mb-3 shadow-md">Kesimpulan</div>
                      <div className="space-y-2 text-[8px] leading-relaxed text-gray-600">
                        <p className="font-bold text-gray-900">1. BUKAN SEKADAR TEORI</p>
                        <p>
                          AI akhirnya bukan sekadar teori, tapi pengalaman nyata yang mengajarkan problem solving, kerja tim, dan inovasi.
                        </p>
                        <div className="flex gap-2 mt-2">
                          <img src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=200&auto=format&fit=crop" className="w-12 h-12 object-cover rounded-sm grayscale" alt="code" referrerPolicy="no-referrer" />
                          <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=200&auto=format&fit=crop" className="w-12 h-12 object-cover rounded-sm grayscale" alt="laptop" referrerPolicy="no-referrer" />
                        </div>
                        <p className="font-bold text-gray-900 mt-2">2. QUOTE</p>
                        <p className="italic text-blue-600">
                          “Teknologi hanyalah alat, yang membuatnya berarti adalah cara kita menggunakannya.”
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Page>

            {/* Page 6: IoT Article 1 - Left Spread */}
            <Page number={6}>
              <div className="h-full bg-white text-gray-900 p-4 md:p-8 pr-12 md:pr-24 flex flex-col relative overflow-y-auto border-r border-gray-100">
                <div className="flex gap-6 mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-serif font-black uppercase tracking-tight leading-tight mb-2">
                      IoT dalam<br/>
                      <span className="text-blue-600">Aktivitas</span><br/>
                      Kampus
                    </h2>
                  </div>
                  <div className="w-1/3 pt-1">
                    <p className="text-[7px] leading-relaxed text-gray-400 mt-2">
                      <Tooltip text="Jaringan perangkat fisik yang terhubung ke internet">Internet of Things</Tooltip> (IoT) memungkinkan perangkat saling terhubung melalui internet. Mahasiswa TI memanfaatkan IoT untuk proyek sederhana.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 flex-1">
                  <div className="flex-1 space-y-2 text-[8px] leading-relaxed text-gray-600 columns-2 gap-4 break-words hyphens-auto">
                    <p className="font-bold text-gray-900 text-[9px] mb-1">Teknologi Sederhana Berdampak</p>
                    <p>
                      Mahasiswa Teknik Informatika memanfaatkan IoT untuk proyek sederhana: sistem lampu otomatis, sensor suhu, dan pemantauan ruangan. Manfaat nyata yang dirasakan adalah efisiensi listrik, pemantauan otomatis, dan pengalaman langsung mengaplikasikan teori di lapangan.
                    </p>
                    <p>
                      Tantangan yang dihadapi meliputi jaringan tidak stabil, perangkat error, atau integrasi yang sulit. Proses ini melatih mahasiswa dalam hal kerja tim, kesabaran, dan kemampuan troubleshooting yang mendalam.
                    </p>
                    <div className="bg-emerald-50 p-2 border-l-4 border-emerald-600 my-1 break-inside-avoid">
                      <p className="text-[8px] font-bold text-emerald-800 uppercase mb-0.5">💡 Insight IoT</p>
                      <p className="text-[7px] italic text-emerald-700">“Setiap error adalah langkah menuju solusi yang lebih baik.” Proyek IoT membuktikan teknologi sederhana bisa berdampak signifikan.</p>
                    </div>
                  </div>
                  <div 
                    className="w-[140px] h-[180px] bg-gray-100 rounded-sm overflow-hidden shadow-lg relative flex-shrink-0 mt-2 cursor-zoom-in"
                    onClick={() => setSelectedImage("https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop")}
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=500&auto=format&fit=crop" 
                      alt="IoT Tech" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 border-[6px] border-white/20"></div>
                  </div>
                </div>
              </div>
            </Page>

            {/* Page 7: IoT Article 2 - Ri            <Page number={7}>
              <div className="p-0 h-full flex flex-col bg-white overflow-y-auto">
                <div 
                  className="h-28 w-full overflow-hidden relative cursor-zoom-in"
                  onClick={() => setSelectedImage("https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=1000&auto=format&fit=crop")}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=1000&auto=format&fit=crop" 
                    alt="IoT Visual" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-emerald-900/20"></div>
                </div>
                
                <div className="p-4 md:p-8 pl-12 md:pl-24 flex-1 flex flex-col">
                  <h2 className="text-xl md:text-2xl font-serif font-black uppercase tracking-tight text-gray-900 mb-4 border-b-2 border-gray-100 pb-2">
                    Efficiency & Collaboration
                  </h2>

                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <div className="inline-block bg-emerald-600 text-white px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest mb-3 shadow-md">Efisiensi</div>
                      <div className="space-y-2 text-[8px] leading-relaxed text-gray-600">
                        <p className="font-bold text-gray-900">1. PENGHEMATAN ENERGI</p>
                        <p>
                          Sistem lampu otomatis yang dikembangkan mahasiswa membantu mengurangi pemborosan listrik di ruangan yang tidak terpakai.
                        </p>
                        <p className="font-bold text-gray-900">2. MONITORING REAL-TIME</p>
                        <p>
                          Sensor suhu dan kelembapan memberikan data akurat untuk kenyamanan mahasiswa di dalam kelas.
                        </p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="inline-block bg-blue-600 text-white px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest mb-3 shadow-md">Kolaborasi</div>
                      <div className="space-y-2 text-[8px] leading-relaxed text-gray-600">
                        <p className="font-bold text-gray-900">1. KERJA TIM</p>
                        <p>
                          Proyek IoT melatih kemampuan kerja tim. Terdapat pembagian peran antara bagian <Tooltip text="Komponen fisik dari sistem komputer">hardware</Tooltip>, <Tooltip text="Program dan data yang dijalankan oleh komputer">software</Tooltip>, dan pengujian sistem.
                        </p>
                        <div className="flex gap-2 mt-2">
                          <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=200&auto=format&fit=crop" className="w-12 h-12 object-cover rounded-sm grayscale cursor-zoom-in" alt="team" referrerPolicy="no-referrer" onClick={() => setSelectedImage("https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop")} />
                          <img src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=200&auto=format&fit=crop" className="w-12 h-12 object-cover rounded-sm grayscale cursor-zoom-in" alt="tech" referrerPolicy="no-referrer" onClick={() => setSelectedImage("https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1000&auto=format&fit=crop")} />
                        </div>
                        <p className="font-bold text-gray-900 mt-2">2. DAMPAK NYATA</p>
                        <p>
                          IoT membuktikan bahwa teknologi sederhana dapat memberikan dampak yang nyata dalam kehidupan sehari-hari di kampus.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Page>        </Page>

            {/* Page 8: Smart Parking 1 - Left Spread */}
            <Page number={8}>
              <div className="h-full bg-white text-gray-900 p-4 md:p-8 pr-12 md:pr-24 flex flex-col relative overflow-y-auto border-r border-gray-100">
                <div className="flex gap-6 mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-serif font-black uppercase tracking-tight leading-tight mb-2">
                      Dari Ide<br/>
                      <span className="text-blue-600">ke Aksi</span>
                    </h2>
                  </div>
                  <div className="w-1/3 pt-1">
                    <p className="text-[7px] leading-relaxed text-gray-400 mt-2">
                      Permasalahan parkir di kampus mendorong mahasiswa TI membuat Smart Parking. Dari <Tooltip text="Proses kreatif untuk menghasilkan ide-ide baru">brainstorming</Tooltip> hingga coding.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 flex-1">
                  <div className="flex-1 space-y-2 text-[8px] leading-relaxed text-gray-600 columns-2 gap-4 break-words hyphens-auto">
                    <p className="font-bold text-gray-900 text-[9px] mb-1">Cerita di Balik Smart Parking</p>
                    <p>
                      Permasalahan parkir di kampus mendorong mahasiswa TI membuat Smart Parking. Dari brainstorming hingga coding, mereka mengatasi sensor error, sistem yang gagal, dan kendala koneksi yang sering muncul di lapangan.
                    </p>
                    <p>
                      Hasilnya, meski belum sempurna, sistem mampu menunjukkan ketersediaan parkir real-time. Proses ini mengajarkan teamwork, manajemen waktu, dan problem solving yang sangat berharga bagi karir masa depan mereka.
                    </p>
                    <div className="bg-blue-50 p-2 border-l-4 border-blue-600 my-1 break-inside-avoid">
                      <p className="text-[8px] font-bold text-blue-800 uppercase mb-0.5">🚗 Problem Solving</p>
                      <p className="text-[7px] italic text-blue-700">“Masalah kecil bisa menjadi awal dari inovasi besar.” Kisah ini membuktikan semangat pantang menyerah mahasiswa.</p>
                    </div>
                  </div>
                  <div 
                    className="w-[140px] h-[180px] bg-gray-100 rounded-sm overflow-hidden shadow-lg relative flex-shrink-0 mt-2 cursor-zoom-in"
                    onClick={() => setSelectedImage("https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=1000&auto=format&fit=crop")}
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=500&auto=format&fit=crop" 
                      alt="Parking Tech" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 border-[6px] border-white/20"></div>
                  </div>
                </div>
              </div>
            </Page>

            {/* Page 9: Smart Parking 2 - Right Spread */}
            <Page number={9}>
              <div className="p-0 h-full flex flex-col bg-white overflow-y-auto">
                <div 
                  className="h-28 w-full overflow-hidden relative cursor-zoom-in"
                  onClick={() => setSelectedImage("https://images.unsplash.com/photo-1470224114660-3f6686c562eb?q=80&w=1000&auto=format&fit=crop")}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1470224114660-3f6686c562eb?q=80&w=1000&auto=format&fit=crop" 
                    alt="Success Visual" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-blue-900/20"></div>
                </div>
                
                <div className="p-4 md:p-8 pl-12 md:pl-24 flex-1 flex flex-col">
                  <h2 className="text-xl md:text-2xl font-serif font-black uppercase tracking-tight text-gray-900 mb-4 border-b-2 border-gray-100 pb-2">
                    Challenges & Achievements
                  </h2>

                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <div className="inline-block bg-blue-600 text-white px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest mb-3 shadow-md">Tantangan</div>
                      <div className="space-y-2 text-[8px] leading-relaxed text-gray-600">
                        <p className="font-bold text-gray-900">1. AKURASI SENSOR</p>
                        <p>
                          Salah satu kendala utama adalah akurasi sensor dalam mendeteksi kendaraan secara <Tooltip text="Sistem yang merespons kejadian dalam waktu yang sangat singkat">real-time</Tooltip> di berbagai kondisi cuaca.
                        </p>
                        <p className="font-bold text-gray-900">2. INTEGRASI SISTEM</p>
                        <p>
                          Menghubungkan hardware dengan aplikasi mobile membutuhkan ketelitian ekstra agar data yang ditampilkan selalu sinkron.
                        </p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="inline-block bg-emerald-600 text-white px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest mb-3 shadow-md">Pencapaian</div>
                      <div className="space-y-2 text-[8px] leading-relaxed text-gray-600">
                        <p className="font-bold text-gray-900">1. SOLUSI NYATA</p>
                        <p>
                          Sistem ini berhasil memberikan gambaran nyata bagaimana teknologi dapat menyelesaikan masalah parkir yang semrawut.
                        </p>
                        <p className="font-bold text-gray-900">2. PENGEMBANGAN DIRI</p>
                        <p>
                          Melalui proyek ini, mahasiswa belajar banyak tentang manajemen proyek, troubleshooting, dan kerja sama tim yang solid.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Page>

            {/* Page 10: Machine Learning - Left Spread */}
            <Page number={10}>
              <div className="p-4 md:p-8 pr-12 md:pr-24 h-full flex flex-col bg-[#f0f9ff] text-gray-900 border-r border-blue-100 overflow-y-auto relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/30 rounded-bl-full -z-0"></div>
                
                <div className="mb-6 relative z-10">
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Rubrik Prodi</span>
                  <h2 className="text-2xl md:text-3xl font-serif font-black uppercase tracking-tighter text-gray-900 mt-3 leading-tight">
                    Machine Learning:<br/>
                    <span className="text-blue-600">Masa Depan Data</span>
                  </h2>
                  <div className="w-16 h-1 bg-blue-600 mt-4"></div>
                </div>
                
                <div className="flex-1 space-y-4 text-[9px] leading-relaxed text-gray-700 relative z-10">
                  <p className="font-bold text-gray-900 text-[10px] border-b border-gray-200 pb-1 inline-block">Transformasi Akademik Berbasis AI</p>
                  <p className="mt-2">
                    Mahasiswa Teknik Informatika UHAMKA kini tengah mendalami <Tooltip text="Cabang AI yang fokus pada pengembangan algoritma yang belajar dari data">Machine Learning</Tooltip> sebagai instrumen utama untuk melakukan analisis data akademik yang mendalam. Fokus utamanya adalah memprediksi performa nilai, melakukan segmentasi data mahasiswa, hingga mengidentifikasi pola belajar yang paling efektif.
                  </p>
                  <p>
                    Meskipun menghadapi tantangan teknis seperti kompleksitas <Tooltip text="Serangkaian instruksi langkah demi langkah untuk menyelesaikan masalah">algoritma</Tooltip> dan keterbatasan dataset, semangat inovasi tetap membara. Mahasiswa diajarkan untuk tidak hanya sekadar mengolah angka, tetapi mengubah tumpukan data menjadi informasi strategis yang bermanfaat bagi institusi.
                  </p>
                  
                  <div className="grid grid-cols-1 gap-3 mt-4">
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-blue-50 hover:border-blue-200 transition-colors group">
                      <p className="text-[8px] font-black text-blue-600 uppercase mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                        Key Learnings & Focus
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 p-2 rounded-lg">
                          <p className="font-bold text-gray-900 text-[8px]">Prediksi Nilai</p>
                          <p className="text-[7px] text-gray-500">Estimasi akurat performa akademik.</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-lg">
                          <p className="font-bold text-gray-900 text-[8px]">Pola Belajar</p>
                          <p className="text-[7px] text-gray-500">Analisis perilaku studi mahasiswa.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Page>

            {/* Page 11: Tips & Tricks - Right Spread */}
            <Page number={11}>
              <div className="p-6 md:p-12 pl-12 md:pl-24 h-full flex flex-col bg-white overflow-y-auto">
                <div className="mb-8">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-600 mb-3">Tips & Tricks</p>
                  <h2 className="text-xl md:text-2xl font-serif font-black uppercase tracking-tighter text-gray-900 leading-tight">Langkah Kecil<br/>Inovasi</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-sm flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-[11px] mb-0.5 uppercase tracking-tight">Mulai dari Masalah Sederhana</h4>
                      <p className="text-[9px] text-gray-600 leading-relaxed">Jangan mencari ide yang terlalu jauh. Perhatikan masalah kecil yang Anda temui setiap hari di kampus atau rumah.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-sm flex-shrink-0">2</div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-[11px] mb-0.5 uppercase tracking-tight">Jangan Takut Mencoba</h4>
                      <p className="text-[9px] text-gray-600 leading-relaxed">Ketakutan akan kegagalan adalah penghambat inovasi. Mulailah melangkah dan lihat apa yang terjadi.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-sm flex-shrink-0">3</div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-[11px] mb-0.5 uppercase tracking-tight">Error adalah Bagian dari Proses</h4>
                      <p className="text-[9px] text-gray-600 leading-relaxed">Setiap error yang Anda temukan adalah pelajaran baru yang mendekatkan Anda pada solusi sempurna.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-sm flex-shrink-0">4</div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-[11px] mb-0.5 uppercase tracking-tight">Kerja Tim Sangat Penting</h4>
                      <p className="text-[9px] text-gray-600 leading-relaxed">Kolaborasi membawa perspektif berbeda yang memperkaya hasil akhir proyek.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Page>

            {/* Page 12: Workflow - Left Spread */}
            <Page number={12}>
              <div className="p-4 md:p-8 pr-12 md:pr-24 h-full flex flex-col bg-[#0a0a0f] text-white border-r border-white/5 overflow-y-auto">
                <div className="mb-6">
                  <p className="text-[8px] font-black uppercase tracking-[0.4em] text-blue-400 mb-1.5">Workflow</p>
                  <h2 className="text-xl md:text-2xl font-serif font-black uppercase tracking-tighter leading-tight">Proses Redaksi</h2>
                </div>
                
                <div className="flex-1 relative">
                  <div className="absolute left-3 top-0 bottom-0 w-[1px] bg-blue-600/30"></div>
                  <div className="space-y-6 pl-8">
                    <div className="relative">
                      <div className="absolute -left-[37px] top-1 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                      <h4 className="font-bold text-blue-400 text-[9px] uppercase tracking-widest mb-0.5"><Tooltip text="Proses kreatif untuk menghasilkan ide-ide baru">Brainstorming</Tooltip> Ide</h4>
                      <p className="text-[8px] text-gray-400 leading-relaxed">Pengumpulan ide dan penentuan topik utama yang relevan dengan mahasiswa TI.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[37px] top-1 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                      <h4 className="font-bold text-blue-400 text-[9px] uppercase tracking-widest mb-0.5">Draft & Editing Bahasa</h4>
                      <p className="text-[8px] text-gray-400 leading-relaxed">Proses penyusunan artikel, narasi, dan materi yang akan disajikan.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[37px] top-1 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                      <h4 className="font-bold text-blue-400 text-[9px] uppercase tracking-widest mb-0.5">Peer Review</h4>
                      <p className="text-[8px] text-gray-400 leading-relaxed">Review antar anggota untuk memastikan kualitas konten dan akurasi data.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[37px] top-1 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                      <h4 className="font-bold text-blue-400 text-[9px] uppercase tracking-widest mb-0.5"><Tooltip text="Tata letak elemen visual pada halaman">Layout</Tooltip> Digital</h4>
                      <p className="text-[8px] text-gray-400 leading-relaxed">Pembuatan visual majalah yang menarik menggunakan tools desain digital.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[37px] top-1 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                      <h4 className="font-bold text-blue-400 text-[9px] uppercase tracking-widest mb-0.5">Publikasi Online</h4>
                      <p className="text-[8px] text-gray-400 leading-relaxed">Penyebaran majalah secara digital agar dapat diakses oleh khalayak luas.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Page>

            {/* Page 13: Kesimpulan - After Rubrik */}
            <Page number={13}>
              <div className="h-full bg-[#f8fafc] p-6 md:p-12 pl-12 md:pl-24 flex flex-col overflow-y-auto border-l border-gray-100">
                <div className="mb-8">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-600 mb-2">Closing</p>
                  <h2 className="text-xl md:text-2xl font-serif font-black uppercase tracking-tighter text-gray-900">Kesimpulan</h2>
                </div>
                
                <div className="space-y-6 flex-1">
                  <div className="space-y-4">
                    <p className="text-[11px] text-gray-700 leading-relaxed">
                      Digital Insight Edisi Perdana ini merangkum perjalanan inovatif mahasiswa Teknik Informatika UHAMKA dalam mengeksplorasi potensi teknologi masa depan.
                    </p>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                        <div className="w-1.5 h-full bg-blue-600 rounded-full"></div>
                        <p className="text-[9px] text-gray-600">
                          <span className="font-bold text-gray-900 uppercase block mb-1">AI & IoT</span>
                          Transformasi layanan kampus melalui otomasi dan perangkat cerdas yang memudahkan aktivitas akademik.
                        </p>
                      </div>
                      <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                        <div className="w-1.5 h-full bg-blue-600 rounded-full"></div>
                        <p className="text-[9px] text-gray-600">
                          <span className="font-bold text-gray-900 uppercase block mb-1">Machine Learning</span>
                          Pemanfaatan data untuk solusi prediktif dan analisis mendalam guna mendukung pengambilan keputusan.
                        </p>
                      </div>
                      <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                        <div className="w-1.5 h-full bg-blue-600 rounded-full"></div>
                        <p className="text-[9px] text-gray-600">
                          <span className="font-bold text-gray-900 uppercase block mb-1">Kolaborasi</span>
                          Sinergi mahasiswa TI Kelas 2F dalam mewujudkan literasi digital dan kreativitas tanpa batas.
                        </p>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-700 leading-relaxed italic font-serif border-l-4 border-blue-600 pl-4 py-2 bg-blue-50/50">
                      "Kesimpulannya, teknologi adalah alat, namun kreativitas mahasiswalah yang memberikan jiwa pada setiap inovasi yang tercipta."
                    </p>
                  </div>

                  <div className="bg-blue-600 p-6 rounded-xl shadow-lg">
                    <p className="text-[11px] text-white font-serif italic leading-relaxed text-center">
                      "Pergi ke pasar membeli ikan,<br/>
                      Ikan dimasak bumbunya meresap.<br/>
                      Teknologi canggih kita kembangkan,<br/>
                      UHAMKA maju, masa depan mantap."
                    </p>
                  </div>
                </div>
              </div>
            </Page>

            {/* Page 14: Tim Redaksi - Right Spread */}
            <Page number={14}>
              <div className="p-6 md:p-12 pl-12 md:pl-24 h-full flex flex-col bg-[#fcfcfc] overflow-y-auto relative">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 opacity-50"></div>
                
                <div className="mb-10 relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-[2px] bg-blue-600"></div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Editorial Board</p>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif font-black uppercase tracking-tighter text-gray-900 leading-none">Tim Redaksi</h2>
                  <p className="text-[10px] text-gray-400 mt-2 font-medium italic">Wajah di balik layar Digital Insight Edisi Perdana</p>
                </div>
                
                <div className="flex-1 relative z-10">
                  <div className="grid grid-cols-1 gap-6">
                    {[
                      { name: "Dinianti Marselia", role: "Editor in Chief / Project Lead", initial: "DM", email: "dinianti.marselia@uhamka.ac.id" },
                      { name: "Anggoro Galih Niswantoro", role: "Lead Designer / Layout Artist", initial: "AN", email: "niswantorogalih@gmail.com" },
                      { name: "Della Cyntia Azzahra", role: "Content Writer / Researcher", initial: "DA", email: "dellacyntia00@gmail.com" },
                      { name: "Hikmah Putra Perdana", role: "Technical Writer / AI Specialist", initial: "HP", email: "hikmahputraperdana99@gmail.com" },
                      { name: "Ayuni Maynisa", role: "Creative Director / Illustrator", initial: "AM", email: "ayunimaynisa0@gmail.com" }
                    ].map((member, idx) => (
                      <div key={idx} className="group flex items-center gap-5 p-3 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-blue-100">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-sm font-black text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                            {member.initial}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-[11px] font-black text-gray-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{member.name}</p>
                          <p className="text-[8px] text-blue-500 font-bold uppercase tracking-widest mb-1">{member.role}</p>
                          <p className="text-[9px] text-blue-600 font-medium tracking-tight hover:underline cursor-pointer">{member.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Page>

            {/* Page 15: References - Back Cover */}
            <Page number={15}>
              <div className="h-full bg-[#1a3a3a] text-white p-6 md:p-8 pr-12 md:pr-24 flex flex-col justify-between relative overflow-y-auto border-l border-white/5">
                <div className="relative z-10">
                  <div className="mb-8">
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#ffd700] mb-1.5">Bibliography</p>
                    <h2 className="text-xl md:text-2xl font-serif font-black uppercase tracking-tighter leading-tight">Referensi</h2>
                  </div>
                  
                  <div className="space-y-2 pt-6 border-t border-white/10">
                    {[
                      "How AI Is Transforming Campus Life, TechToday Magazine, Mei 2025",
                      "Student Chatbots: Automating Campus Queries with AI, Digital Campus Journal, 2025",
                      "IoT Projects Every Student Should Try, MakerTech Review, 2025",
                      "Five Ways the Internet of Things Is Improving Education, EduTech Insights, 2026",
                      "How Machine Learning Helps Students Understand Data, AI For Everyone, 2025",
                      "Smart Solutions: Campus Parking Gets a Technology Upgrade, Campus Innovator, 2026",
                      "Machine Learning in Everyday College Projects, TechWise Student Magazine, 2025",
                      "Error and Success: Student Reflections on Learning to Code, Code & Learn Quarterly, 2025",
                      "Workflow Secrets for Successful Student Publications, Digital Editors Digest, 2026",
                      "The Rise of Student‑Led Tech Initiatives Worldwide, Global Tech Student Review, 2025"
                    ].map((ref, i) => (
                      <div key={i} className="flex gap-2 items-start group">
                        <span className="text-[7px] font-mono text-[#ffd700] mt-0.5">[{i+1}]</span>
                        <p className="text-[8px] text-gray-400 leading-tight group-hover:text-white transition-colors">{ref}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 flex justify-between items-end mt-6 border-t border-white/10 pt-6">
                  <div>
                    <p className="text-[7px] font-black uppercase tracking-[0.5em] text-[#ffd700] mb-0.5">Copyright 2026</p>
                    <p className="text-[9px] font-bold">Teknik Informatika Universitas Muhammadiyah Prof. Dr. HAMKA</p>
                  </div>
                  <div className="text-[7px] text-blue-200 font-mono">EDISI-01-FINAL</div>
                </div>
              </div>
            </Page>
          </HTMLFlipBook>

          {/* Navigation Controls - Desktop Side Buttons (Enhanced) */}
          <div className="hidden md:block absolute top-1/2 -left-20 -translate-y-1/2 z-20">
            <button 
              onClick={prevButtonClick}
              className="p-6 bg-white/5 hover:bg-blue-600 text-white rounded-full transition-all duration-500 hover:scale-110 active:scale-95 backdrop-blur-md border border-white/10 group"
              aria-label="Previous Page"
            >
              <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="hidden md:block absolute top-1/2 -right-20 -translate-y-1/2 z-20">
            <button 
              onClick={nextButtonClick}
              className="p-6 bg-white/5 hover:bg-blue-600 text-white rounded-full transition-all duration-500 hover:scale-110 active:scale-95 backdrop-blur-md border border-white/10 group"
              aria-label="Next Page"
            >
              <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Footer Info & Mobile Controls (Modernized) */}
        <div className="mt-12 md:mt-16 flex flex-col items-center gap-8 w-full max-w-sm">
          <div className="flex items-center justify-between w-full gap-6">
            <button 
              onClick={prevButtonClick}
              className="flex-1 py-3 px-6 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] uppercase tracking-[0.3em] transition-all font-black border border-white/5 active:scale-95"
            >
              Prev
            </button>
            <div className="relative group">
              <div className="text-white font-mono text-lg font-black flex items-center gap-2">
                <span className="text-blue-500">{currentPage + 1}</span>
                <span className="text-gray-600">/</span>
                <span>{totalPages}</span>
              </div>
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform"></div>
            </div>
            <button 
              onClick={nextButtonClick}
              className="flex-1 py-3 px-6 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] uppercase tracking-[0.3em] transition-all font-black border border-white/5 active:scale-95"
            >
              Next
            </button>
          </div>
          
          <div className="w-full space-y-4">
            <div 
              className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-[2px] cursor-pointer group/progress relative"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = x / rect.width;
                const targetPage = Math.floor(percentage * totalPages);
                jumpToPage(targetPage);
              }}
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full relative z-10"
                initial={{ width: 0 }}
                animate={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/progress:opacity-100 transition-opacity z-20">
                <p className="text-[8px] text-white font-black uppercase tracking-widest bg-black/50 px-2 py-0.5 rounded">Jump to Page</p>
              </div>
            </div>
            <p className="text-gray-500 text-[9px] uppercase tracking-[0.4em] text-center font-bold">
              Interactive Digital Journal Experience
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
