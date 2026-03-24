'use client';

import { useState } from 'react';
import { QrCode, X } from 'lucide-react';
import { Button } from '@heroui/react';

export default function ShareQR() {
  const [show, setShow] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <>
      <Button size="sm" variant="outline" onPress={() => setShow(true)}>
        <QrCode size={14} />
        QR код
      </Button>

      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShow(false)} />
          <div className="relative z-10 rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900 text-center">
            <button
              onClick={() => setShow(false)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Откройте на телефоне
            </h3>
            {/* Simple QR placeholder using API */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`}
              alt="QR код"
              width={200}
              height={200}
              className="mx-auto rounded-lg"
            />
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 break-all">{url}</p>
          </div>
        </div>
      )}
    </>
  );
}
