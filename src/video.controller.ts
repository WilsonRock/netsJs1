import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import * as ytdl from 'ytdl-core';

@Controller('videos')
export class VideoController {
  @Get(':videoLink')
  async downloadVideo(@Param('videoLink') videoLink: string, @Res() res: Response) {
    try {
      // Extraer el identificador del video de YouTube desde el enlace completo
      const videoId = this.extractVideoIdFromLink(videoLink);

      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const info = await ytdl.getInfo(videoUrl);
      
      // Filtrar los formatos disponibles para elegir uno que tenga audio y calidad más alta
      const videoFormat = ytdl.chooseFormat(info.formats, { quality: 'highest' , filter: 'audioandvideo' });

      res.set({
        'Content-Disposition': `attachment; filename="${info.videoDetails.title}.mp4"`,
        'Content-Type': 'video/mp4',
      });

      ytdl(videoUrl, { format: videoFormat }).pipe(res);
    } catch (error) {
      console.error('Error downloading video:', error);
      res.status(500).send('Error downloading video.');
    }
  }

  private extractVideoIdFromLink(videoLink: string): string {
    // Puedes usar expresiones regulares u otros métodos para extraer el identificador del video
    // Aquí utilizamos un ejemplo simple que asume que el identificador está al final de la URL
    const parts = videoLink.split('?v=');
    if (parts.length === 2) {
      return parts[1];
    } else {
      throw new Error('Invalid video link');
    }
  }
}
