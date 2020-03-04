om det klagas på att det inte hittar firebase admin, kör:
npm install firebase-admin --save

ladda ner nyckel från firebase console > project settings > service accounts > generate new private key
döp den till serviceAccountKey.json och lägg den i mappen /private (eller redigera urlen i .js-filen)

kör 
har gjort en batch-fil som går att köras direkt
 ELLER
node backup.js <collection>
obs! den sparar bara en nivå av dokument. dvs om ett dokument innehar ytterligare collections sparas inte dem!