'use client';

import type { AnchorHTMLAttributes } from 'react';
import { sendTrackingEvent, type AnalyticsPayload } from '@/lib/tracking';

type TrackableExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  tracking: AnalyticsPayload;
};

export default function TrackableExternalLink({
  tracking,
  onClick,
  ...props
}: TrackableExternalLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        sendTrackingEvent(tracking);
        onClick?.(event);
      }}
    />
  );
}
