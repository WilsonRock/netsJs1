import { Controller, Get, Param, Res } from '@nestjs/common';
import * as ytdl from 'ytdl-core';
import { Response } from 'express';

@Controller('youtube')
export class IdvideoController {
  @Get(':videoId')
  async downloadVideo(@Param('videoId') videoId: string, @Res() res: Response) {
    try {
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const videoInfo = await ytdl.getInfo(videoUrl);
      const videoFormat = ytdl.chooseFormat(videoInfo.formats, { quality: 'highest' , filter: 'audioandvideo'});
/*       res.header({
        'Content-Disposition', `attachment; filename="${videoInfo.videoDetails.title}.mp4"`,
        'Content-Type': 'video/mp4',
      }); */
      res.header({
        'Content-Disposition': `attachment; filename="${videoInfo.videoDetails.title}.mp4"`,
        'Content-Type': 'video/mp4',
      });
      
        ytdl(videoUrl, { format: videoFormat })
        .pipe(res);
    } catch (error) {
      res.status(500).send('Error al descargar el video de YouTube.');
    }
  }
}
