export const getArithmeticMean = (list: Array<number>) => {
    const sum = list.reduce((acc, num) => acc + num, 0);
    const { length } = list;

    return sum / length;
};
