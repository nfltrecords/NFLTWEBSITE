import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Headphones,
  Mic2,
  Newspaper,
  Pause,
  Play,
  Radio,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { configuredRadioStream, radioStation } from "@/lib/radio";
import { publicPages, type Locale } from "@/lib/seo";
import studio from "@/assets/hero-studio.jpg";

function RadioPlayer({ locale }: { locale: Locale }) {
  const fr = locale === "fr";
  const audio = useRef<HTMLAudioElement>(null);
  const stream = configuredRadioStream(radioStation.streamUrl);
  const [playing, setPlaying] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  async function play() {
    if (!stream || !audio.current) return;
    setStatus("loading");
    try {
      await audio.current.play();
      setStatus("idle");
    } catch {
      setPlaying(false);
      setStatus("error");
    }
  }
  return (
    <section className="radio-player" aria-label={fr ? "Lecteur radio" : "Radio player"}>
      <div className="radio-player-top">
        <span className="eyebrow mb-0 flex items-center gap-3">
          <Radio size={18} aria-hidden="true" /> {fr ? "LE DIRECT" : "THE STREAM"}
        </span>
        <span className="radio-status">
          {stream ? (fr ? "En direct" : "Live") : fr ? "En préparation" : "Coming soon"}
        </span>
      </div>
      <div className="radio-player-body">
        <div className="flex gap-3">
          <Button
            size="icon"
            className="radio-control"
            disabled={!stream || playing || status === "loading"}
            onClick={play}
            aria-label={fr ? "Lire la radio" : "Play radio"}
            title={fr ? "Lire la radio" : "Play radio"}
            aria-describedby="radio-stream-status"
          >
            <Play aria-hidden="true" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="radio-control"
            disabled={!stream || !playing}
            onClick={() => audio.current?.pause()}
            aria-label={fr ? "Mettre en pause" : "Pause radio"}
            title={fr ? "Mettre en pause" : "Pause radio"}
            aria-describedby="radio-stream-status"
          >
            <Pause aria-hidden="true" />
          </Button>
        </div>
        <div className="min-w-0">
          <p className="radio-now-label">{fr ? "MAINTENANT À L’ANTENNE" : "NOW ON AIR"}</p>
          <p className="radio-now-title">
            {fr ? "Programmation à venir" : "Programming coming soon"}
          </p>
          <p className="metadata-note">
            {fr
              ? "La radio 24/7 de NFLT RECORDS arrive bientôt."
              : "The NFLT RECORDS 24/7 radio is coming soon."}
          </p>
          <p id="radio-stream-status" className="metadata-note" role="status">
            {!stream
              ? fr
                ? "En préparation"
                : "Coming soon"
              : status === "error"
                ? fr
                  ? "Flux indisponible — réessayez ultérieurement"
                  : "Stream unavailable — try again later"
                : status === "loading"
                  ? fr
                    ? "Connexion en cours…"
                    : "Connecting…"
                  : playing
                    ? fr
                      ? "Lecture en cours"
                      : "Playing"
                    : fr
                      ? "En pause"
                      : "Paused"}
          </p>
        </div>
      </div>
      <audio
        ref={audio}
        src={stream}
        preload="none"
        onPlaying={() => {
          setPlaying(true);
          setStatus("idle");
        }}
        onPause={() => setPlaying(false)}
        onWaiting={() => setStatus("loading")}
        onEnded={() => setPlaying(false)}
        onError={() => {
          if (stream) {
            setPlaying(false);
            setStatus("error");
          }
        }}
      />
    </section>
  );
}

export function RadioTeaser({ locale }: { locale: Locale }) {
  const fr = locale === "fr";
  return (
    <section className="radio-theme radio-teaser editorial-section">
      <div>
        <p className="eyebrow flex items-center gap-3">
          <Radio size={18} aria-hidden="true" />{" "}
          {fr ? "RADIO / EN PRÉPARATION" : "RADIO / COMING SOON"}
        </p>
        <h2>
          NFLT RECORDS
          <br />
          NYC RADIO
        </h2>
      </div>
      <div>
        <p className="body-copy">
          {fr
            ? "Une future radio internationale 24/7. La programmation et le lancement seront annoncés ici."
            : "A future international 24/7 radio station. Programming and launch announcements will appear here."}
        </p>
        <Button asChild variant="outline" className="editorial-action mt-8">
          <Link to={publicPages.radio[locale]}>
            {fr ? "Découvrir la radio" : "Discover the radio"}
            <ArrowUpRight />
          </Link>
        </Button>
      </div>
    </section>
  );
}

export function RadioPage({ locale }: { locale: Locale }) {
  const fr = locale === "fr";
  const upcoming = [
    { icon: CalendarDays, fr: "Grille de programmes", en: "Programme schedule", index: "01" },
    { icon: Mic2, fr: "Émissions", en: "Shows", index: "02" },
    { icon: Headphones, fr: "Podcasts", en: "Podcasts", index: "03" },
    { icon: Video, fr: "Vidéos", en: "Videos", index: "04" },
    { icon: Newspaper, fr: "Actualités", en: "News", index: "05" },
  ];
  return (
    <SiteLayout>
      <div className="radio-theme">
        <section className="radio-hero">
          <img
            src={studio}
            alt={
              fr
                ? "Console de studio — visuel de production musicale"
                : "Studio console — music production visual"
            }
            className="radio-photo"
          />
          <div className="radio-scrim" />
          <div className="radio-hero-content">
            <div className="radio-hero-top">
              <p className="eyebrow mb-0">
                {fr ? "RADIO INTERNATIONALE / À VENIR" : "INTERNATIONAL RADIO / COMING SOON"}
              </p>
              <span className="radio-status">{fr ? "En préparation" : "Coming soon"}</span>
            </div>
            <h1 aria-label={radioStation.name}>
              <span>NFLT RECORDS</span>
              <span>NYC RADIO</span>
            </h1>
            <div className="radio-hero-bottom">
              <p>
                {fr
                  ? "Une future radio internationale 24/7, dans l’univers de NFLT RECORDS."
                  : "A future international 24/7 radio station, part of the NFLT RECORDS world."}
              </p>
              <span className="radio-frequency">
                24/7<span>{fr ? "PROJET RADIO" : "RADIO PROJECT"}</span>
              </span>
            </div>
          </div>
        </section>
        <div className="editorial-section radio-content">
          <RadioPlayer locale={locale} />
          <section className="radio-upcoming" aria-labelledby="radio-format-title">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{fr ? "FORMAT / MIX A + C" : "FORMAT / MIX A + C"}</p>
                <h2 id="radio-format-title">
                  {fr ? "Une programmation hybride" : "A hybrid programme"}
                </h2>
              </div>
            </div>
            <div className="radio-editorial-grid">
              {[
                {
                  i: "A",
                  fr: ["Rotation NFLT", "Les 18 sorties de l’artiste NFLT en rotation récurrente."],
                  en: [
                    "NFLT rotation",
                    "The 18 releases by the artist NFLT in recurring rotation.",
                  ],
                },
                {
                  i: "C",
                  fr: ["Radio musicale internationale", "Hip-hop, rap, R&B, soul et nouveautés."],
                  en: ["International music radio", "Hip-hop, rap, R&B, soul and new releases."],
                },
                {
                  i: "+",
                  fr: [
                    "Émissions & invités",
                    "Créneaux prévus pour émissions, interviews et invités.",
                  ],
                  en: ["Shows & guests", "Slots planned for shows, interviews and guests."],
                },
              ].map((b) => (
                <article key={b.i} className="radio-editorial-item">
                  <div className="radio-item-top">
                    <span>{b.i}</span>
                  </div>
                  <h3>{(fr ? b.fr : b.en)[0]}</h3>
                  <p>{(fr ? b.fr : b.en)[1]}</p>
                </article>
              ))}
            </div>
          </section>
          <section className="radio-upcoming" aria-labelledby="radio-week-title">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{fr ? "PROGRAMME HEBDOMADAIRE" : "WEEKLY SCHEDULE"}</p>
                <h2 id="radio-week-title">{fr ? "La semaine à l’antenne" : "The week on air"}</h2>
              </div>
              <span>{fr ? "PROGRAMMATION À VENIR" : "PROGRAMMING COMING SOON"}</span>
            </div>
            <div className="radio-editorial-grid">
              {(fr
                ? ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]
                : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
              ).map((d, n) => (
                <article key={d} className="radio-editorial-item">
                  <div className="radio-item-top">
                    <span>0{n + 1}</span>
                  </div>
                  <h3>{d}</h3>
                  <p>{fr ? "Programmation à venir" : "Programming coming soon"}</p>
                </article>
              ))}
            </div>
          </section>
          <section className="radio-upcoming" aria-labelledby="radio-upcoming-title">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{fr ? "LA SUITE / BIENTÔT" : "WHAT’S NEXT / SOON"}</p>
                <h2 id="radio-upcoming-title">{fr ? "L’univers radio" : "The radio world"}</h2>
              </div>
              <span>{fr ? "EN PRÉPARATION" : "COMING SOON"}</span>
            </div>
            <div className="radio-editorial-grid">
              {upcoming.map((item) => (
                <article key={item.index} className="radio-editorial-item">
                  <div className="radio-item-top">
                    <item.icon size={28} strokeWidth={1} aria-hidden="true" />
                    <span>{item.index}</span>
                  </div>
                  <h3>{fr ? item.fr : item.en}</h3>
                  <p>{fr ? "Bientôt" : "Coming soon"}</p>
                </article>
              ))}
            </div>
          </section>
          <div className="radio-back">
            <span>NFLT RECORDS / NYC RADIO</span>
            <Button asChild variant="link">
              <Link to={publicPages.home[locale]}>
                {fr ? "Le label NFLT RECORDS" : "The NFLT RECORDS label"}
                <ArrowUpRight />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
