import { Badge } from '@/components/ui/badge';

export function RatingBar({
	rating,
	maxRating,
}: {
	rating: number;
	maxRating: number;
}) {
	const percentage = (rating / maxRating) * 100;

	return (
		<div className='flex flex-col md:flex-row space-y-2 md:space-y-0 items-center w-full space-x-0 md:space-x-4 md:px-6 sm:px-4 px-2'>
			<Badge className='w-fit py-0.5 md:py-2 bg-fuchsia-950 flex-shrink-0'>
				Prompt rating
			</Badge>

			<div className='relative h-3 w-full bg-gray-200 rounded shadow'>
				<div
					className='absolute h-full bg-purple-400 rounded transition-all duration-500 ease-in-out'
					role='progressbar'
					style={{
						width: `${percentage}%`,
					}}
				>
					<span className='sr-only'>
						User rating: {rating} out of {maxRating}
					</span>
				</div>
				<div className='absolute inset-0 flex items-center justify-center font-bold tracking-wide'>
					<span className='text-[11px] flex space-x-2'>
						<span>{rating}</span>
						<span>/</span>
						<span className='tracking-widest'>{maxRating}</span>
					</span>
				</div>
			</div>
		</div>
	);
}
