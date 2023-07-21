import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import * as ytdl from 'ytdl-core';
import { Response } from 'express';

@Controller('youtube')
export class IdvideoController {
  @Get(':videoId')
  async downloadVideo(
    @Param('videoId') videoId: string,
    @Query('audioOnly') audioOnly: boolean,
    @Res() res: Response,
  ) {
    try {
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const videoInfo = await ytdl.getInfo(videoUrl);

      let videoFormat;
      if (audioOnly) {
        videoFormat = ytdl.chooseFormat(videoInfo.formats, { filter: 'audioonly' });
      } else {
        videoFormat = ytdl.chooseFormat(videoInfo.formats, { quality: 'highest', filter: 'audioandvideo' });
      }

      res.header({
        'Content-Disposition': `attachment; filename="${videoInfo.videoDetails.title}.${videoFormat.container}"`,
        'Content-Type': `video/${videoFormat.container}`,
      });

      ytdl(videoUrl, { format: videoFormat })
        .pipe(res);
    } catch (error) {
      res.status(500).send('Error al descargar el video de YouTube.');
    }
  }
}
