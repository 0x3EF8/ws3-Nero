/**
 * Command: benchmark
 * Description: Performs a detailed benchmark on command execution by simulating command runs.
 *              It measures execution time, memory usage, CPU load, throughput, and error counts.
 *              Finally, it uses Google Generative AI to produce a concise summary (max 3 sentences) of the results.
 * Usage: benchmark
 *
 * Example:
 *   benchmark
 */
module.exports = {
    name: 'benchmark',
    description: 'Performs a detailed benchmark on command execution and produces a concise AI summary.',
    category: 'admin',
    usage: 'benchmark',
    run: async function(api, event, args) {
      const { getCommandList } = require('../../lib/commandManager');
      const os = require('os');
      const process = require('process');
      const path = require('path');
      require('dotenv').config({ path: path.join(__dirname, '../../config/.env') });
      const { GoogleGenerativeAI } = require('@google/generative-ai');
  
      const { adminCommands, userCommands } = getCommandList();
      const commands = userCommands.concat(adminCommands);
      const totalCommands = commands.length;
      const results = [];
  
      const memoryBefore = process.memoryUsage().heapUsed;
      const cpuBefore = os.loadavg()[0];
      const benchmarkStart = process.hrtime.bigint();
      let totalExecutionTime = 0;
      let failedCommands = 0;
  
      for (const command of commands) {
        const cmdStart = process.hrtime.bigint();
        let errorMessage = null;
        try {
          // Simulate command execution (could extend this to actually run a test command if needed)
          await new Promise(resolve => setImmediate(resolve));
        } catch (error) {
          errorMessage = error.message || 'Unknown error';
          failedCommands++;
        }
        const cmdEnd = process.hrtime.bigint();
        const execTime = Number(cmdEnd - cmdStart) / 1e6;
        totalExecutionTime += execTime;
        results.push({
          name: command.name,
          time: execTime,
          error: errorMessage,
          category: command.category
        });
      }
  
      const memoryAfter = process.memoryUsage().heapUsed;
      const cpuAfter = os.loadavg()[0];
      const benchmarkEnd = process.hrtime.bigint();
      const benchmarkDuration = Number(benchmarkEnd - benchmarkStart) / 1e6;
      const memoryUsed = ((memoryAfter - memoryBefore) / 1024 / 1024).toFixed(2) + ' MB';
      const cpuChange = (cpuAfter - cpuBefore).toFixed(2);
      const avgExecTime = (totalExecutionTime / totalCommands).toFixed(2);
      const throughput = (totalCommands / (benchmarkDuration / 1000)).toFixed(2);
      const fastest = results.reduce((prev, curr) => (curr.time < prev.time ? curr : prev), results[0]);
      const slowest = results.reduce((prev, curr) => (curr.time > prev.time ? curr : prev), results[0]);
  
      let report = `System Benchmark Report\n\n`;
      report += `Total Commands Tested: ${totalCommands}\n`;
      report += `Total Execution Time: ${totalExecutionTime.toFixed(2)} ms\n`;
      report += `Benchmark Duration: ${benchmarkDuration.toFixed(2)} ms\n`;
      report += `Average Execution Time: ${avgExecTime} ms\n`;
      report += `Throughput: ${throughput} commands/sec\n`;
      report += `Memory Used: ${memoryUsed}\n`;
      report += `CPU Load Change: ${cpuChange}\n`;
      report += `Commands Failed: ${failedCommands}\n\n`;
      report += `Fastest Command: ${fastest.name} (${fastest.time.toFixed(2)} ms)\n`;
      report += `Slowest Command: ${slowest.name} (${slowest.time.toFixed(2)} ms)\n\n`;
      report += `Command Performance:\n`;
  
      results.forEach(cmd => {
        const typeSymbol = (cmd.category.toLowerCase() === 'admin') ? "[A]" : "[U]";
        const namePadded = cmd.name.padEnd(15, " ");
        const timeFormatted = cmd.time.toFixed(2).padStart(8, " ");
        report += `${typeSymbol} ${namePadded}: ${timeFormatted}ms`;
        if (cmd.error) report += ` | ERROR: ${cmd.error}`;
        report += "\n";
      });
  
      let summaryExplanation = "";
      try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
          const prompt = `Summarize the following benchmark report in no more than three concise sentences, explaining key metrics briefly:\n\n${report}\n\nSummary:`;
          const result = await model.generateContent(prompt);
          summaryExplanation = result.response.text().trim();
        } else {
          summaryExplanation = "Google API key not configured.";
        }
      } catch (err) {
        console.error("Error generating AI summary:", err);
        summaryExplanation = "Error generating AI summary.";
      }
  
      const finalReport = report + "\n\nAI Summary:\n" + summaryExplanation;
      return api.sendMessage(finalReport, event.threadID);
    }
  };
  
