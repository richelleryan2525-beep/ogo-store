'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { TrashIcon } from '../Icons';

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageManager({ images, onChange }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');
  const [pasteUrl, setPasteUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files);
    if (!list.length) return;
    setErr('');
    setUploading(true);
    const uploaded: string[] = [];
    try {
      for (const file of list) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/erp/upload', { method: 'POST', body: fd, credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Could not upload "${file.name}".`);
        uploaded.push(data.url);
      }
      onChange([...images, ...uploaded]);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function removeAt(i: number) {
    onChange(images.filter((_, idx) => idx !== i));
  }

  function makeMain(i: number) {
    if (i === 0) return;
    const next = [...images];
    const [picked] = next.splice(i, 1);
    next.unshift(picked);
    onChange(next);
  }

  function addPastedUrl() {
    const url = pasteUrl.trim();
    if (!url) return;
    onChange([...images, url]);
    setPasteUrl('');
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
        }}
        className={`flex min-h-[110px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed p-5 text-center transition-colors ${
          dragOver ? 'border-gold bg-surface-3' : 'border-line bg-bg'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
        <p className="text-sm font-semibold">
          {uploading ? 'Uploading…' : 'Drag photos here, or click to browse'}
        </p>
        <p className="text-xs text-muted">JPEG, PNG, WEBP, GIF or AVIF — up to 8MB each</p>
      </div>

      {err && <p className="mt-2 text-sm font-medium text-danger">{err}</p>}

      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
          {images.map((src, i) => (
            <div key={src + i} className="group relative aspect-square overflow-hidden rounded-lg border border-line bg-surface-3">
              <Image src={src} alt="" fill sizes="140px" className="object-cover" unoptimized />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded bg-ink px-1.5 py-0.5 text-[10px] font-bold text-bg">Main</span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-black/55 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => makeMain(i)}
                    className="rounded bg-white/90 px-1.5 py-1 text-[10px] font-semibold text-ink"
                  >
                    Set main
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  aria-label="Remove photo"
                  className="ml-auto grid h-6 w-6 place-items-center rounded bg-white/90 text-danger"
                >
                  <TrashIcon size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <input
          value={pasteUrl}
          onChange={(e) => setPasteUrl(e.target.value)}
          placeholder="Or paste an image URL"
          className="min-h-[42px] flex-1 rounded-lg border border-line bg-bg px-3 text-sm"
        />
        <button type="button" onClick={addPastedUrl} className="min-h-[42px] rounded-lg border border-line px-3.5 text-sm font-semibold">
          Add
        </button>
      </div>
    </div>
  );
}
