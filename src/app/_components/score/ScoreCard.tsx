import {
  Card,
  CardBody,
  CardFooter,
  Chip,
  CircularProgress,
} from "@nextui-org/react";

export function ScoreCard({
  score,
  footerText,
}: {
  score: number;
  footerText?: string;
}) {
  return (
    <Card className="h-fit w-fit overflow-hidden border-none bg-gradient-to-br from-peachYellow to-giantsOrange">
      <CardBody className="items-center justify-center">
        <CircularProgress
          classNames={{
            svg: "w-36 h-36 drop-shadow-md",
            indicator: "stroke-blue",
            track: "stroke-blue/10",
            value: "text-3xl font-semibold text-blue",
          }}
          value={score}
          strokeWidth={2}
          showValueLabel={true}
        />
      </CardBody>
      {footerText && (
        <CardFooter className="pt-0">
          <Chip
            classNames={{
              base: "border-1 border-white/30",
              content: "text-white/90 text-small font-semibold",
            }}
            variant="bordered"
            className=" before:none text-start"
          >
            Total score
          </Chip>
        </CardFooter>
      )}
    </Card>
  );
}
