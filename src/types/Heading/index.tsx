import { type HeadingProps } from "@chakra-ui/react";

export interface PageHeadingProps extends HeadingProps {
    header: string;
    description: string;
}

export interface SectionHeadingProps extends HeadingProps {
    header: string;
    description?: string;
}
