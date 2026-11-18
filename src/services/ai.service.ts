import api, { unwrap } from "./api";
import type { CVAnalysis, MatchResult } from "../types";

export const aiService = {
  analyzeCv: (file?: File) => {
    const form = new FormData();
    if (file) form.append("cv", file);
    return unwrap<CVAnalysis>(api.post("/ai/analyze-cv", form, { timeout: 90000 }));
  },
  latest: () => unwrap<CVAnalysis | null>(api.get("/ai/analyses/latest")),
  history: () => unwrap<CVAnalysis[]>(api.get("/ai/analyses")),
  match: (internshipId: string) => unwrap<MatchResult>(api.post("/ai/match-internship", { internshipId }, { timeout: 90000 }))
};
