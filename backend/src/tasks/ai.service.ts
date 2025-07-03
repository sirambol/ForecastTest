import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';

@Injectable()
export class AiService {
  async classifyUrgency(title: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const process = spawn('python3', ['ai/camembert_classifier.py', title]);

      let result = '';
      let error = '';

      process.stdout.on('data', (data) => {
        result += data.toString();
      });

      process.stderr.on('data', (data) => {
        error += data.toString();
      });

      process.on('close', (code) => {
        if (code !== 0 || error) {
          return reject(new Error(`Erreur CamemBERT: ${error || 'code ' + code}`));
        }

        const parsed = parseInt(result.trim(), 10);
        if (isNaN(parsed)) return reject(new Error('Valeur non numérique retournée'));
        resolve(parsed);
      });
    });
  }
}
