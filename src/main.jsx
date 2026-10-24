import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Heart, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { apologyText, memories } from "./data/content";
import "./styles.css";

const fadeUp = (reduced) => ({
  initial: { opacity: 0, y: reduced ? 0 : 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: reduced ? 0 : 0.7, ease: "easeOut" }
});

function FloatingHearts({ burst = false }) {
  const hearts = Array.from({ length: burst ? 18 : 10 });
  return <div className="floating-hearts" aria-hidden="true">{hearts.map((_, i) => <span className={burst ? "burst-heart" : ""} key={i} style={{ "--i": i }}>♥</span>)}</div>;
}

function MusicToggle({ enabled, onToggle }) {
  return <button className="music-toggle" onClick={onToggle} aria-label={enabled ? "Mute music" : "Enable music"} title="Optional music (off by default)">
    {enabled ? <Volume2 size={16} /> : <VolumeX size={16} />} <span>{enabled ? "Music on" : "Music off"}</span>
  </button>;
}

function EnvelopeIntro({ opened, onOpen }) {
  const reduced = useReducedMotion();
  return <section className="intro section-shell" id="intro">
    <FloatingHearts />
    <div className="top-note">A tiny letter, wrapped with lots of love <span>✦</span></div>
    <motion.div className="intro-copy" {...fadeUp(reduced)}>
      <p className="eyebrow">FOR SOMEONE VERY SPECIAL</p>
      <h1>For my little<br /><em>sister</em> <span>💗</span></h1>
      <p className="intro-subtitle">Ek chhota sa letter hai tere liye...</p>
    </motion.div>
    <motion.div className={`envelope-wrap ${opened ? "is-open" : ""}`} animate={reduced ? {} : { y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
      <div className="peek-character" aria-hidden="true"><div className="cat-ears">⌃</div><div className="cat-face">•ᴗ•</div><div className="cat-blush">˘</div></div>
      <button className="envelope" onClick={onOpen} aria-label="Open my letter">
        <div className="envelope-back" /><div className="envelope-paper"><span>With love, always</span></div>
        <div className="envelope-front" /><div className="envelope-flap" /><div className="seal"><Heart fill="currentColor" size={17} /></div>
      </button>
    </motion.div>
    <button className="primary-button" onClick={onOpen}>{opened ? "Opening your letter..." : "Open my letter"} <span>💌</span></button>
    <p className="scroll-hint">tap the envelope to open <span>↓</span></p>
  </section>;
}

function ApologyLetter({ onNext, resetKey }) {
  const [messageIndex, setMessageIndex] = useState(0);
  const reduced = useReducedMotion();
  const isLastMessage = messageIndex === apologyText.paragraphs.length - 1;
  const continueLetter = () => {
    if (isLastMessage) {
      onNext();
      return;
    }
    setMessageIndex((index) => index + 1);
  };

  React.useEffect(() => {
    setMessageIndex(0);
  }, [resetKey]);

  return <section className="letter-section section-shell" id="letter">
    <motion.div className="letter-card paper-texture" {...fadeUp(reduced)}>
      <div className="letter-topline"><span>✦</span> A note from your bhai <span>✦</span></div>
      <h2>I'm sorry, <em>meri jaan</em> <span>🥺</span></h2>
      <div className="letter-body">
        <p className="greeting">{apologyText.greeting}</p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={messageIndex} className="letter-message" initial={{ opacity: 0, y: reduced ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -8 }} transition={{ duration: reduced ? 0 : 0.25 }} aria-live="polite">
            <p>{apologyText.paragraphs[messageIndex]}</p>
            {isLastMessage && <p className="signoff">{apologyText.signoff.split("\n").map((line) => <React.Fragment key={line}>{line}<br /></React.Fragment>)}</p>}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="letter-progress" aria-label={`Message ${messageIndex + 1} of ${apologyText.paragraphs.length}`}>
        {apologyText.paragraphs.map((_, index) => <span key={index} className={index <= messageIndex ? "active" : ""} />)}
      </div>
      <button className="primary-button" onClick={continueLetter}>{isLastMessage ? <>See our special moments <span>✨</span></> : <>Continue <span>→</span></>}</button>
    </motion.div>
    <div className="letter-stamp" aria-hidden="true">SORRY<br /><b>♡</b></div>
  </section>;
}

function MemoryCarousel({ onNext }) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const next = () => setIndex((index + 1) % memories.length);
  const previous = () => setIndex((index - 1 + memories.length) % memories.length);
  return <section className="memories-section section-shell" id="memories">
    <motion.div className="section-heading" {...fadeUp(reduced)}><p className="eyebrow">A LITTLE SCRAPBOOK</p><h2>Some special <em>moments</em> <span>📸</span></h2><p>Chhoti-chhoti yaadein, par mere liye bahut special ✨</p></motion.div>
    <div className="carousel-area">
      <button className="circle-control prev" onClick={previous} aria-label="Previous memory"><ArrowLeft size={19} /></button>
      <div className="memory-window">
        <AnimatePresence mode="wait" initial={false}><motion.div key={index} className="memory-card" drag="x" dragConstraints={{ left: 0, right: 0 }} onDragEnd={(_, info) => { if (info.offset.x < -50) next(); if (info.offset.x > 50) previous(); }} initial={{ opacity: 0, x: reduced ? 0 : 35 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduced ? 0 : -35 }} transition={{ duration: reduced ? 0 : 0.35 }}>
          <div className="memory-image" style={{ backgroundColor: memories[index].color }}><div className="doodle-sun">✦</div><span className="memory-icon">{memories[index].icon}</span><div className="doodle-heart">♡</div><span className="photo-note">your photo here</span></div>
          <p>{memories[index].caption}</p><Heart className="card-heart" size={17} fill="currentColor" />
        </motion.div></AnimatePresence>
      </div>
      <button className="circle-control next" onClick={next} aria-label="Next memory"><ArrowRight size={19} /></button>
    </div>
    <div className="pagination" aria-label="Memory pagination">{memories.map((memory, i) => <button key={memory.caption} className={i === index ? "active" : ""} onClick={() => setIndex(i)} aria-label={`Go to memory ${i + 1}`} />)}</div>
    <button className="text-button" onClick={onNext}>one more thing <span>→</span></button>
  </section>;
}

function ForgivenessSection({ onRestart }) {
  const [answer, setAnswer] = useState(null);
  const [hug, setHug] = useState(false);
  const reduced = useReducedMotion();
  return <section className="question-section section-shell" id="question">
    {hug && <FloatingHearts burst />}
    <motion.div className="big-heart" animate={reduced ? {} : { scale: [1, 1.08, 1] }} transition={{ duration: 1.6, repeat: Infinity }}><Heart fill="currentColor" size={48} /></motion.div>
    <motion.div {...fadeUp(reduced)}><p className="eyebrow">NO PRESSURE, PROMISE</p><h2>Ek baat poochun,<br /><em>meri chhoti si sister?</em> 🥺</h2><p className="question-copy">Abhi bhi gussa hai kya mujhse? <span>❤️</span></p></motion.div>
    <AnimatePresence mode="wait">
      {!answer ? <motion.div className="answer-buttons" key="answers" {...fadeUp(reduced)}><button className="soft-button" onClick={() => setAnswer("angry")}>Thoda sa gussa hai 😤</button><button className="primary-button" onClick={() => setAnswer("talk")}>Chal, baat karte hain 🫂</button></motion.div> : <motion.div className="answer-card" key="answer" {...fadeUp(reduced)}><p>{answer === "angry" ? "Koi baat nahi, meri jaan. Tu apna time le. Main yahin hoon jab tera mann kare. ❤️" : "Yay! 🥹❤️ Chal, saari baatein aaram se sort karte hain. Tu mere liye bahut special hai!"}</p><button className="primary-button" onClick={() => setHug(true)}>{hug ? "Hug sent! 💗" : "Send a hug 🤗"}</button></motion.div>}
    </AnimatePresence>
    <button className="restart-button" onClick={onRestart}><RotateCcw size={15} /> read it again</button>
  </section>;
}

function App() {
  const [opened, setOpened] = useState(false);
  const [showMemories, setShowMemories] = useState(false);
  const [music, setMusic] = useState(false);
  const openLetter = () => { setOpened(true); setTimeout(() => document.getElementById("letter")?.scrollIntoView({ behavior: "smooth" }), 950); };
  const goTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const [restartKey, setRestartKey] = useState(0);
  const revealMemories = () => {
    setShowMemories(true);
    setTimeout(() => goTo("memories"), 50);
  };
  const restart = () => { setOpened(false); setShowMemories(false); setRestartKey((key) => key + 1); setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50); };
  return <main><MusicToggle enabled={music} onToggle={() => setMusic(!music)} /><EnvelopeIntro opened={opened} onOpen={openLetter} />{opened && <ApologyLetter resetKey={restartKey} onNext={revealMemories} />}{showMemories && <MemoryCarousel onNext={() => goTo("question")} />}<ForgivenessSection onRestart={restart} /><footer>made with a full heart, just for you <span>♡</span></footer></main>;
}

createRoot(document.getElementById("root")).render(<App />);
