export const getArithmeticMean = list => {
    const sum = list.reduce((acc, num) => acc + num, 0);
    const { length } = list;

    return sum / length;
}