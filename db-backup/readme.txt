om det klagas p� att det inte hittar firebase admin, k�r:
npm install firebase-admin --save

ladda ner nyckel fr�n firebase console > project settings > service accounts > generate new private key
d�p den till serviceAccountKey.json och l�gg den i mappen /private (eller redigera urlen i .js-filen)

k�r 
node backup.js <collection>
obs! den sparar bara en niv� av dokument. dvs om ett dokument innehar ytterligare collections sparas inte dem!