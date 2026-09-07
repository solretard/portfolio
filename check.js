const xrpl = require("xrpl");
(async () => {
  const c = new xrpl.Client("wss://s1.ripple.com");
  await c.connect();
  const res = await c.request({
    command: "account_tx",
    account: "rJjyTDkp1X4hthPwTBBQaT91gbEdJDwi42",
    limit: 30,
  });
  for (const t of res.result.transactions) {
    const tx = t.tx_json || t.tx || {};
    if (![103424514, 103424515].includes(tx.Sequence)) continue;
    console.log("\n===", tx.TransactionType, "seq", tx.Sequence, "===");
    console.log("ledger:      ", t.ledger_index);
    console.log("result:      ", t.meta?.TransactionResult);
    console.log("delivered:   ", JSON.stringify(t.meta?.delivered_amount));
    console.log("SendMax:     ", JSON.stringify(tx.SendMax));
    console.log("Amount:      ", JSON.stringify(tx.Amount));
    console.log("LimitAmount: ", JSON.stringify(tx.LimitAmount));
    console.log("Paths:       ", tx.Paths ? "present" : "NONE");
  }
  console.log("\n=== current trustlines ===");
  const lines = await c.request({
    command: "account_lines",
    account: "rJjyTDkp1X4hthPwTBBQaT91gbEdJDwi42",
  });
  for (const l of lines.result.lines) {
    console.log(l.currency, "| issuer:", l.account, "| balance:", l.balance, "| limit:", l.limit);
  }
  console.log("\n=== balance ===");
  const info = await c.request({
    command: "account_info",
    account: "rJjyTDkp1X4hthPwTBBQaT91gbEdJDwi42",
  });
  console.log("XRP:", xrpl.dropsToXrp(info.result.account_data.Balance));
  console.log("OwnerCount:", info.result.account_data.OwnerCount);
  await c.disconnect();
})();
