import clsx from "clsx";
import { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]){
    //override the classes for the button when needed
    return twMerge(clsx(inputs));
}