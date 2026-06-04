'use client';

import { useEffect } from 'react';
import { sendTrackingEvent } from '@/lib/tracking';

export default function ProductViewTracker({
  productId,
  productName,
  category,
}: {
  productId: string;
  productName: string;
  category?: string;
}) {
  useEffect(() => {
    sendTrackingEvent({
      event: 'product_view',
      productId,
      productName,
      category,
      label: 'Vista de producto',
    });
  }, [category, productId, productName]);

  return null;
}
