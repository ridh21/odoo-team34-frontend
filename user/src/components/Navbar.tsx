import Image from 'next/image';
import Link from 'next/link';
import Logo from "@/assets/Krushimart_logo.png"

export default function Home() {
return (
    <div className="bg-gray-100">
      {/* Header */}
	<header className="bg-white shadow-md p-6 flex justify-between items-center">
		<div className="flex items-center space-x-2">
			<Image src={Logo} alt="KrushiMart Logo" width={40} height={40} />
			<h1 className="text-green-700 text-2xl font-bold">KrushiMart</h1>
		</div>

		<nav>
			<ul className="flex space-x-16">
			<li>
				<Link href="/"
					className="text-gray-700 text-xl transition-colors duration-300 ease-in-out hover:text-green-700 hover:font-semibold">
				Home
				</Link>
			</li>
			<li>
				<Link href="/marketplace"
					className="text-gray-700 text-xl transition-colors duration-300 ease-in-out hover:text-green-700 hover:font-semibold">
				Market Place
				</Link>
			</li>
			<li>
				<Link href="/about"
					className="text-gray-700 text-xl transition-colors duration-300 ease-in-out hover:text-green-700 hover:font-semibold">
				About Us
				</Link>
			</li>
			</ul>
		</nav>

		<Link href="/login">
			<button className="bg-green-700 text-white px-6 py-2 rounded-md transition-all duration-300 ease-in-out
							hover:bg-green-800 hover:shadow-[0_4px_10px_rgba(34,197,94,0.3)] hover:font-semibold">
			Login
			</button>
		</Link>
</header>

    </div>
);
}
