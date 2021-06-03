import React from 'react';
import dynamic from 'next/dynamic';

const IndexView = dynamic(
  () => import('src/views/Index'),
  { ssr: false },
);

export default function Home(props: any) {
  return <IndexView {...props} />;
}
