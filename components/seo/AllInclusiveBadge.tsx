import { CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

interface AllInclusiveBadgeProps {
    size?: 'hero' | 'inline' | 'compact';
    className?: string;
}

const SIZE_STYLES: Record<NonNullable<AllInclusiveBadgeProps['size']>, string> = {
    hero: 'gap-2 px-4 py-2 text-base sm:text-lg rounded-full',
    inline: 'gap-1.5 px-2.5 py-1 text-xs sm:text-sm rounded-full',
    compact: 'gap-1 px-2 py-0.5 text-[11px] rounded-md',
};

const ICON_SIZE: Record<NonNullable<AllInclusiveBadgeProps['size']>, string> = {
    hero: 'h-5 w-5',
    inline: 'h-3.5 w-3.5',
    compact: 'h-3 w-3',
};

export default function AllInclusiveBadge({ size = 'inline', className }: AllInclusiveBadgeProps) {
    const label = size === 'compact'
        ? 'All-Inclusive'
        : 'All-Inclusive · Tolls + Bata + Permit + GST';
    return (
        <span
            className={clsx(
                'inline-flex items-center font-semibold bg-emerald-700 text-white shadow-sm',
                SIZE_STYLES[size],
                className,
            )}
            aria-label="All-inclusive pricing: tolls, driver bata, state permit, and GST are included in the fare"
        >
            <CheckCircle2 className={clsx(ICON_SIZE[size], 'shrink-0')} aria-hidden="true" />
            <span>{label}</span>
        </span>
    );
}
