import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/Card";

interface Props {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function StepCard({ number, title, description, icon }: Props) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              {number}
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
          <div className="text-zinc-500">{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
