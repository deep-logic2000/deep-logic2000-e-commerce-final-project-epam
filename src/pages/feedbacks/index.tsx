import { ReactElement } from 'react';
import Link from 'next/link';

function Feedbacks(): ReactElement {
  return (
    <>
      <h1 className="text-white">Feedbacks Page</h1>;
      <Link href="/" className="border-2 text-white">
        To Home
      </Link>
    </>
  );
}

export default Feedbacks;