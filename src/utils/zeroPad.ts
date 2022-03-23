export default function zeroPad(n: number) {
    return (n < 10) ? `0${n.toString()}` : n.toString();
}