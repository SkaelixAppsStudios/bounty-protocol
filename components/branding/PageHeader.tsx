import { Typography } from "@whop/frosted-ui";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
}

export const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
    return (
        <div className="mb-6 space-y-1">
            <div className="flex items-baseline gap-2">
                <Typography.Title size="3" weight="bold">
                    {title}
                </Typography.Title>
                <Typography.Text size="2" className="text-gray-500">
                    by Skaelix Apps Studios
                </Typography.Text>
            </div>
            {subtitle && (
                <Typography.Text size="2" color="gray">
                    {subtitle}
                </Typography.Text>
            )}
        </div>
    );
};
