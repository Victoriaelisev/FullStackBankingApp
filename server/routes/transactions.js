const { getTransactions, generatePDF } = require('../utils/common');
Router.get('/transactions/:id', authMiddleware, async (req, res) => {
  const { start_date, end_date } = req.query;
  try {
    const result = await getTransactions(req.params.id, start_date, end_date);
    res.send(result.rows);
  } catch (error) {
    res.status(400).send({
      transactions_error:
        'Error while getting transactions list..Try again later.'
    });
  }
});

Router.get('/download/:id', authMiddleware, async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const account_id = req.params.id;
    const result = await getTransactions(account_id, start_date, end_date);
    const basePath = path.join(__dirname, '..', 'views');
    const templatePath = path.join(basePath, 'transactions.ejs');
    const templateString = ejs.fileLoader(templatePath, 'utf-8');
    const template = ejs.compile(templateString, { filename: templatePath });

    const accountData = await func.getAccountByAccountId(account_id);
    accountData.account_no = accountData.account_no
      .slice(-4)
      .padStart(accountData.account_no.length, '*');
    const output = template({
      start_date: moment(start_date).format('Do MMMM YYYY'),
      end_date: moment(end_date).format('Do MMMM YYYY'),
      account: accountData,
      transactions: result.rows
    });
    fs.writeFileSync(
      path.join(basePath, 'transactions.html'),
      output,
      (error) => {
        if (error) {
          throw new Error();
        }
      }
    );
    // res.sendFile(path.join(basePath, 'transactions.html'));
    const pdfSize = await generatePDF(basePath);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfSize
    });
    res.sendFile(path.join(basePath, 'transactions.pdf'));
  } catch (error) {
    res.status(400).send({
      transactions_error: 'Error while downloading..Try again later.'
    });
  }
});