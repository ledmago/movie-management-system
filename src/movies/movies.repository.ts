import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Movie, MovieDocument } from "./movies.schema";
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
  }: {
    userAge: number;
    skip: number;
    limit: number;
    currentTime: Date;
  }): Promise<MovieDocument[]> {
    const query = {
        ageRestriction: {
            $lte: userAge
        },
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
}
