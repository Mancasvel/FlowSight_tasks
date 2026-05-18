"use client";

import { motion } from "framer-motion";
import { Download, ExternalLink } from "lucide-react";

const DESKTOP_DOWNLOAD_URL = "https://flowsight.site#download";

export function TasksDownloadSection() {
  return (
    <section id="download" className="relative overflow-hidden bg-white py-24">
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary-teal/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/2 translate-y-1/2 rounded-full bg-primary-cyan/5 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 text-3xl font-bold text-secondary-navy md:text-5xl"
          >
            Local signals.{" "}
            <span className="bg-gradient-to-r from-primary-cyan to-primary-teal bg-clip-text text-transparent">
              Rollups you control.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-lg text-slate-500"
          >
            Task-time views and weekly rollups use the FlowSight desktop agent—signals stay on your machine until you
            export.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-8 text-center shadow-lg shadow-slate-200/40 ring-1 ring-white/80"
        >
          <p className="text-sm text-slate-600">
            Install for Windows, macOS, or Linux from the FlowSight download hub.
          </p>
          <a
            href={DESKTOP_DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-track="tasks-download-desktop"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-cyan to-primary-teal px-6 py-4 font-medium text-white shadow-md transition-all hover:from-primary-teal hover:to-primary-cyan hover:shadow-lg sm:w-auto"
          >
            <Download className="h-5 w-5" aria-hidden />
            Get the desktop agent
            <ExternalLink className="h-4 w-4 opacity-90" aria-hidden />
          </a>
          <p className="text-xs text-slate-400">Opens flowsight.site in a new tab.</p>
        </motion.div>
      </div>
    </section>
  );
}
