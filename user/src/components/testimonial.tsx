import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

import Image1 from "@/assets/farmer1.jpg"
import Image2 from "@/assets/farmer2.jpg"
import Image3 from "@/assets/farmer3.jpg"

const testimonials = [
{
    "quote":
    "Before joining this platform, I struggled to find fair buyers for my organic produce. Now, I sell directly to consumers who truly value natural farming. My income has increased by 40%, and I no longer depend on middlemen!",
    "name": "Hasmukhbhai Patel",
    "role": "Organic Farmer, Gujarat",
    "image": Image1,
},
{
	"quote": "This platform has transformed the way I do business. I can now reach more customers who appreciate organic farming, and my revenue has significantly increased. I no longer worry about market fluctuations!",
	"name": "Savitaben Desai",
	"role": "Organic Farmer, Maharashtra",
	"image": Image2
},
{
	"quote": "With direct access to consumers, I have built strong relationships with buyers who genuinely care about sustainability. This has not only boosted my sales but also given me a sense of purpose in farming.",
	"name": "Ramesh Yadav",
	"role": "Natural Farming Advocate, Uttar Pradesh",
	"image": Image3
}
];

const TestimonialCarousel = () => {
const [index, setIndex] = useState(0);

const prevTestimonial = () => {
    setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
};

const nextTestimonial = () => {
    setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
};

return (
    <div className="flex flex-col items-center justify-center w-full py-12 bg-gray-100">
    <h2 className="text-3xl font-bold text-green-700 mb-6">Success Stories</h2>
    <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden flex relative">
	<div className=" p-6 flex  ">
			<div>
				<AnimatePresence mode="wait">
				<motion.div
					key={index}
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: 20 }}
					transition={{ duration: 0.4 }}
					className="flex flex-col justify-between pr-5 gap-[10rem] h-full"
				>
					<p className="text-lg text-gray-700 mb-4">“{testimonials[index].quote}”</p>
					<div>
					<h3 className="font-semibold text-gray-900">{testimonials[index].name}</h3>
				<p className="text-sm text-gray-600">{testimonials[index].role}</p>
				</div>
				</motion.div>
				</AnimatePresence>
			</div>



        <div className=" h-[400px] w-full overflow-hidden">
		<Image
			src={testimonials[index].image}
			alt={testimonials[index].name}
			width={400}
			height={400}
			className="w-full h-full object-cover rounded-xl"
		/>
		</div>
    </div>
	<div className="absolute top-100 right-0 transform -translate-y-1/2 z-10 space-x-3">
		<button
			onClick={prevTestimonial}
			className="p-3 bg-yellow-950 text-white rounded-full hover:bg-gray-900 shadow-lg"
		>
			<ChevronLeft size={34} />
		</button>
		<button
			onClick={nextTestimonial}
			className="p-3 bg-yellow-950 text-white rounded-full hover:bg-gray-900 shadow-lg"
		>
			<ChevronRight size={34} />
		</button>
		</div>
    </div>
	</div>
);
};

export default TestimonialCarousel;
