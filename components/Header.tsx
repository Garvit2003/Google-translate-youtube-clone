import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

function Header() {
    const {userId}=auth();
  return (
    <header>
        <div>
            <Link href="/">
                <Image
                    src="https://links.papareact.com/xgu"
                    alt="logo"
                    width={200}
                    height={100}
                    className="object-contain h-32 cursor-pointer"
                />


            </Link>
        </div>
    </header>
  )
}

export default Header