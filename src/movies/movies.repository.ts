import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, DeleteResult, ClientSession } from "mongoose";
import { Movie, MovieDocument, Session } from "./movies.schema";
import { UpdateMovieDto } from "./dto/update-movie.dto";

@Injectable()
export class MoviesRepository {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>
  ) {}

  async create(movie: Partial<Movie>): Promise<MovieDocument> {
    const createdMovie = new this.movieModel(movie);
    return createdMovie.save();
  }

  async findById(id: string): Promise<MovieDocument | null> {
    return this.movieModel.findById(id).lean().exec();
  }

  async findAll(skip: number, limit: number): Promise<MovieDocument[]> {
    return this.movieModel.find().skip(skip).limit(limit).lean().exec();
  }

  async update({
    id,
    updateMovieDto,
  }: {
    id: string;
    updateMovieDto: UpdateMovieDto;
  }): Promise<MovieDocument | null> {
    return this.movieModel
      .findByIdAndUpdate(id, updateMovieDto, { new: true })
      .lean()
      .exec();
  }

  async delete(id: string): Promise<MovieDocument | null> {
    return this.movieModel.findByIdAndDelete(id).lean().exec();
  }

  async findByName(name: string): Promise<MovieDocument | null> {
    return this.movieModel.findOne({ name }).lean().exec();
  }

  async addSession(id: string, session: any): Promise<MovieDocument | null> {
    return this.movieModel
      .findByIdAndUpdate(id, { $push: { sessions: session } }, { new: true })
      .lean()
      .exec();
  }

  async removeSession(
    movieId: string,
    sessionId: string
  ): Promise<MovieDocument | null> {
    return this.movieModel
      .findByIdAndUpdate(
        movieId,
        { $pull: { sessions: { _id: sessionId } } },
        { new: true }
      )
      .lean()
      .exec();
  }

  async getAvailableMovies({
    skip,
    limit,
    currentTime,
    userAge,
    name,
    ageRestriction,
  }: {
    userAge: number;
    skip: number;
    limit: number;
    currentTime: Date;
    name?: string;
    ageRestriction?: number;
  }): Promise<MovieDocument[]> {
    const query = {
      ...(name && { name }),
      ...(ageRestriction && {
        ageRestriction: {
          $lte: ageRestriction,
        },
      }),
        sessions: {
          $elemMatch: {
            startDate: {
              $gte: currentTime,
            },
          },
        },
      };
    return this.movieModel.find(query).skip(skip).limit(limit).lean().exec();
  }

  async findMovieAndSessionById({ movieId, movieSessionId }: { movieId: string, movieSessionId: string }): Promise<Movie | null> {
    return this.movieModel.findOne({ _id: movieId, "sessions._id": movieSessionId }).lean().exec();
  }

  async findByRoomAndSessionByTime(sessions: Session[]): Promise<MovieDocument | null> {
    const query = {
      sessions: {
        $elemMatch: {
          roomNumber: { $in: sessions.map(session => session.roomNumber) },
          $or: [
            {
              startDate: { 
                $lte: sessions[0].endDate,
                $gte: sessions[0].startDate 
              }
            },
            {
              endDate: {
                $lte: sessions[0].endDate,
                $gte: sessions[0].startDate
              }
            }
          ]
        }
      }
    };
    return this.movieModel.findOne(query).lean().exec();
  }

  async deleteBulk(movieIds: string[]): Promise<DeleteResult> {
    return this.movieModel.deleteMany({ _id: { $in: movieIds } }).lean().exec();
  }

  async startSession(): Promise<ClientSession> {
    return this.movieModel.startSession();
  }
}
