export default function convertHourToMinute(time: string){
    //separa a hora e converte para number
   const [hour,minutes] = time.split(':').map(Number)

   const timeInMinutes = (hour * 60) + minutes;

   return timeInMinutes;

}