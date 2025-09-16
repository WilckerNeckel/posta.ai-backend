export class MatriculaGenarator {
    public generate(admisionDate: Date): string {
        const year = admisionDate.getFullYear().toString().slice(-2);
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        const semester = admisionDate.getMonth() < 6 ? "01" : "02";
        return `${year}${semester}${randomNumber}`;
    }
}
