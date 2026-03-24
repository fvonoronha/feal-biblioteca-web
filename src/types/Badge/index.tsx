import { type BadgeProps } from "@chakra-ui/react";
import { BookLoan } from "types";

export interface DateBadgeProps extends BadgeProps {
    date?: Date;
    startText?: string;
    endText?: string;
}

export interface AWSRegionBadgeProps extends BadgeProps {
    region?: string;
}

export interface ActiveFilterBadgeProps extends BadgeProps {
    label: string;
    value: string;
    cancelFilter: (value: string) => void;
}

export interface IdBadgeProps extends BadgeProps {
    myId: bigint;
}

export interface LoanBadgeProps extends BadgeProps {
    bookLoan: BookLoan;
}
export interface LabelBadgeProps extends BadgeProps {
    label?: string;
}

export interface ShelfBadgeProps extends BadgeProps {
    shelf?: string;
}

export interface MultipleImagesBadgeProps extends BadgeProps {
    images?: string[];
}
